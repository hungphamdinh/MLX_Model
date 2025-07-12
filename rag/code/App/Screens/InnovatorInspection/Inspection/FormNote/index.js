import React from 'react';
import { StyleSheet } from 'react-native';
import BaseLayout from '@Components/Layout/BaseLayout';
import { FormInput } from '@Forms';
import { FormProvider } from 'react-hook-form';
import { useCompatibleForm } from '@Utils/hook';
import { ImageResource } from '@Themes';
import { useRoute } from '@react-navigation/native';
import NavigationServices from '@NavigationService';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import I18n from '@I18n';


const FormNote = () => {
  const { params, name } = useRoute();
  const routeName = name;

  const callBack = params?.callBack;
  const isView = params?.isView;
  const notes = params?.notes || '';
  const dynamicNotes = params?.dynamicNotes || [];
  const placeholder = params?.placeholder;
  const isSurveyModule = params?.isSurveyModule;
  
  const isDynamicNotes = routeName === 'formNotes';
  const maxLengthNote = isSurveyModule ? 2000 : 500;

  const formMethods = useCompatibleForm({
    defaultValues: {
      comments:
        isDynamicNotes && dynamicNotes.length > 0
          ? dynamicNotes.map((note) => ({ answerComment: note.answerComment || '', formQuestionCommentId: note.id, ...note }))
          : [],
      notes,
    },
  });

  const getTitle = () => {
      if (routeName === 'formNote') {
        return I18n.t('AD_COMMON_NOTES');
      }
      if (routeName === 'formAdditionalAnswer') {
        return I18n.t('FORM_ADDITIONAL_ANSWER');
      }
      if (routeName === 'formDefect') {
        return I18n.t('DEFECT_DESCRIPTION');
      }
      if (isDynamicNotes) {
        return I18n.t('AD_COMMON_NOTES');
      }
      return I18n.t('AD_COMMON_QUANTITY');
  };
  
  const getKeyboardType = () => {
    if (routeName === 'formQuantity') {
      return 'number-pad';
    }
    return 'default';
  };

  const onSubmit = (values) => {
    const callBackValues = isDynamicNotes ? values : values.notes;
    callBack(callBackValues);
    NavigationServices.goBack();
  };

  const mainLayoutProps = {
    title: getTitle(),
    padding: true,
    rightBtn: !isView && {
      icon: ImageResource.IC_SAVE,
      onPress: () => {
        formMethods.handleSubmit(onSubmit)();
      },
      titleOnly: true,
    },

    containerStyle: styles.containerStyle,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView style={styles.wrapper}>
          {dynamicNotes.map((note, index) => (
            <FormInput
              maxLength={maxLengthNote}
              key={index}
              editable={!isView}
              multiline
              label={note.titleComment}
              name={`comments[${index}].answerComment`}
              testID={`comment-${index}`}
              placeholder={'FORM_NOTES_PLACEHOLDER'}
              showCharacterCount
            />
          ))}
           <FormInput
              maxLength={maxLengthNote}
              editable={!isView}
              name="notes"
              multiline
              isNotFocusNextInput
              keyboardType={getKeyboardType()}
              label={getTitle()}
              placeholder={placeholder}
              testID="notes"
              showCharacterCount={isSurveyModule}
            />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default FormNote;

const styles = StyleSheet.create({
  containerStyle: {
    padding: 16,
  },
  notes: {
    height: 120,
  },
  wrapper: {
    marginTop: -20,
  }
});
