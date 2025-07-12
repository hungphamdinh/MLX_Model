import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import SignatureView from '@Components/Delivery/SignatureView';
import I18n from '@I18n';
import useDelivery from '../../../Context/Delivery/Hooks/UseDelivery';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import Input from '../../../Elements/Input';
import FormControl from '../../../Components/Forms/FormControl';

const SignatureCheckOut = ({ navigation }) => {
  const saveSignatures = React.useRef({});
  const allSignatures = React.useRef({});

  const params = navigation.getParam('params');
  const guid = navigation.getParam('guid');
  const screenAmounts = navigation.getParam('screenAmounts') ? navigation.getParam('screenAmounts') : 1;

  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [name, setName] = useState(
    params.length > 0 ? params[0].residentName : params.deliveryReceivementInput?.residentName
  );
  const [isHaveSignature, setIsHaveSignature] = useState(false);

  const disabled = !isHaveSignature || name === '';

  const { checkOutDelivery, checkOutDeliveries, isLoading } = useDelivery();

  const onSubmitSignatures = () => {
    if (saveSignatures.current) {
      saveSignatures.current?.save();
    }
  };

  const onSignatureSaved = async (signature) => {
    allSignatures.current = signature;
    signature.description = name;
    if (params.length > 0) {
      checkOutDeliveries(params, signature, guid, screenAmounts);
    } else {
      checkOutDelivery(params, signature, guid, screenAmounts);
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
          <FormControl label="DELIVERY_NAME" required>
            <Input
              inputProps={{ style: { flex: 1 }, placeholder: I18n.t('DELIVERY_NAME') }}
              content=""
              onChangeText={changeText}
              value={name}
              title="DELIVERY_NAME"
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

export default SignatureCheckOut;
