/* eslint-disable no-unused-expressions */
import React from 'react';
import { ScrollView } from 'react-native';
import BaseLayout from '@Components/Layout/BaseLayout';
import SignatureView from '@Components/Survey/SignatureView';
import I18n from '@I18n';
import styles from './styles';
import { ImageResource, Fonts } from '../../../Themes';
import { Text } from '../../../Elements';

const SignatureScreen = ({ navigation }) => {
  const saveSignatures = React.useRef([]);
  const allSignatures = React.useRef([]);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const names = navigation.getParam('names');
  const totalScore = navigation.getParam('totalScore');
  const workflowId = navigation.getParam('workflowId');
  const workflow = navigation.getParam('workflow');

  const isOnline = workflow ? workflow.isOnline : false;

  const onSubmitSignatures = () => {
    setIsSubmitting(true);
    saveSignatures.current.forEach((saveSignature) => {
      saveSignature();
    });
  };

  const onSignatureSaved = async (signature) => {
    allSignatures.current.push(signature);
    if (allSignatures.current.length === names.length) {
      if (allSignatures.current[0].file) {
        navigation.state.params.onPressSubmit(allSignatures.current);
        navigation.goBack();
      }
      allSignatures.current = [];
      setIsSubmitting(false);
    }
  };

  const onStrokeStart = () => {
    setScrollEnabled(false);
  };

  const onStrokeEnd = () => {
    setScrollEnabled(true);
  };

  const mainLayoutProps = {
    style: styles.container,
    loading: isSubmitting,
    padding: true,
    title: I18n.t('INSPECTION_SIGN_NOW'),
    rightBtn: {
      icon: ImageResource.IC_SAVE,
      onPress: () => {
        onSubmitSignatures();
      },
    },
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <ScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
        {totalScore && !isNaN(totalScore) ? (
          <Text style={styles.textScore}>
            <Text fontFamily={Fonts.Bold} text={`${I18n.t('FORM_TOTAL_SCORE')}: `} />
            <Text text={totalScore} />
          </Text>
        ) : null}
        {names.map((item, index) => (
          <SignatureView
            isUploadDirect={!workflowId || isOnline}
            onSignatureSaved={onSignatureSaved}
            setSaveFnc={(fnc) => (saveSignatures.current[index] = fnc)}
            name={item.name}
            key={item.id}
            onStrokeStart={onStrokeStart}
            onStrokeEnd={onStrokeEnd}
          />
        ))}
      </ScrollView>
    </BaseLayout>
  );
};

export default SignatureScreen;

