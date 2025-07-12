import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import SignatureView from '@Components/Delivery/SignatureView';
import I18n from '@I18n';
import BaseLayout from '../../Components/Layout/BaseLayout';
import Input from '../../Elements/Input';
import FormControl from '../../Components/Forms/FormControl';

const SignatureScreen = ({ navigation }) => {
  const saveSignatures = React.useRef({});
  const allSignatures = React.useRef({});

  const signingName = navigation.getParam('signingName');
  const disabledName = navigation.getParam('disabledName');
  const nameInputTitle = navigation.getParam('nameInputTitle') || 'COMMON_NAME';

  const [scrollEnabled, setScrollEnabled] = React.useState(true);

  const [name, setName] = useState(signingName);

  const [isHaveSignature, setIsHaveSignature] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const disabled = !isHaveSignature || name === '';

  const onSubmitSignatures = () => {
    if (saveSignatures.current) {
      saveSignatures.current?.save();
    }
  };

  const onSignatureSaved = async (signature) => {
    setIsLoading(true);
    try {
      const onSubmit = navigation.getParam('onSubmit');
      allSignatures.current = signature;
      signature.description = name;
      onSubmit(signature);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const onStrokeStart = () => {
    setScrollEnabled(false);
  };

  const onStrokeEnd = () => {
    setScrollEnabled(true);
    setIsHaveSignature(true);
  };

  const onClear = () => {
    setIsHaveSignature(false);
  };

  const mainLayoutProps = {
    loading: isLoading,
    padding: true,
    title: I18n.t('INSPECTION_SIGN_NOW'),
    bottomButtons: [
      {
        disabled,
        title: I18n.t('AD_COMMON_CONFIRM'),
        type: 'primary',
        onPress: onSubmitSignatures,
      },
    ],
  };

  const changeText = (val) => {
    setName(val);
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <ScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20 }}>
          <FormControl label={nameInputTitle} required>
            <Input
              editable={!disabledName}
              inputProps={{ style: { flex: 1 }, placeholder: I18n.t(nameInputTitle) }}
              content=""
              onChangeText={changeText}
              value={name}
              title={nameInputTitle}
            />
          </FormControl>
        </View>
        <SignatureView
          onSignatureSaved={onSignatureSaved}
          onClear={onClear}
          setSaveFnc={(fnc) => (saveSignatures.current.save = fnc)}
          onStrokeStart={onStrokeStart}
          name={name}
          onStrokeEnd={onStrokeEnd}
        />
      </ScrollView>
    </BaseLayout>
  );
};

export default SignatureScreen;
