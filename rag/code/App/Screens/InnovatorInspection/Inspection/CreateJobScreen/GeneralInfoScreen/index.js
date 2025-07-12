import React from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import BaseLayout from '../../../../../Components/Layout/BaseLayout';
import { useCompatibleForm, useYupValidationResolver } from '../../../../../Utils/hook';
import GeneralInfo from '../../../../../Components/InnovatorInspection/Generallnfo';
import { Card } from '../../../../../Elements';
import AwareScrollView from '../../../../../Components/Layout/AwareScrollView';
import { formatDate } from '../../../../../Utils/transformData';
import { INSPECTION_MARCHING_TYPE } from '../../../../../Config/Constants';
import AssigneeInfo from '../../../../../Components/InnovatorInspection/AssigneeInfo';
import useInspection from '../../../../../Context/Inspection/Hooks/UseInspection';

const CardWrapper = styled(Card)`
  margin-horizontal: 0px;
`;

const GeneralInfoScreen = ({ navigation }) => {
  const {
    inspection: { inspectionSetting },
  } = useInspection();
  const { isCreatorAutoAssignmentOff, isShowGeneralInformation } = inspectionSetting;

  const requiredQuestion = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const assigneeValidation = {
    teamId: Yup.number()
      .nullable()
      .when(['isAllowTeamAssignment'], {
        is: true,
        then: Yup.number().nullable().required(requiredQuestion),
      }),
    teamAssigneeId: Yup.number()
      .nullable()
      .when(['isAllowTeamAssignment'], {
        is: false,
        then: Yup.number().nullable().required(requiredQuestion),
      }),
    listAssigneeIds: Yup.array().when(['isAllowTeamAssignment'], {
      is: false,
      then: Yup.array().min(1, requiredQuestion),
    }),
  };
  const validationSchema = Yup.object().shape({
    ...(isCreatorAutoAssignmentOff ? assigneeValidation : {}),
  });

  const selectedProperty = navigation.getParam('selectedProperty');

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      isAllowTeamAssignment: false,
      listAssigneeIds: [],
    },
  });

  const onError = async (values) => {
    console.log('onError', values);
  };

  const onSubmit = async (values) => {
    let marchingType = 0;
    if (values.marchingDate) {
      if (values.marchingIn) {
        marchingType = INSPECTION_MARCHING_TYPE.IN;
      } else {
        marchingType = INSPECTION_MARCHING_TYPE.OUT;
      }
    }

    const generalInfo = {
      ...values,
      marchingDate: formatDate(values.marchingDate, null),
      marchingType,
    };
    delete values.marchingIn;
    delete values.marchingOut;
    navigation.navigate('selectFormToCreate', { selectedProperty, generalInfo });
  };

  const mainLayoutProps = {
    padding: true,
    title: I18n.t('INSPECTION_GENERAL_INFORMATION'),
    bottomButtons: [
      {
        title: I18n.t('COMMON_NEXT'),
        type: 'primary',
        onPress: formMethods.handleSubmit(onSubmit, onError),
      },
    ],
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <CardWrapper>
            {isShowGeneralInformation && (
              <GeneralInfo
                initValues={{ premises: selectedProperty.address }}
                formMethods={formMethods}
                navigation={navigation}
              />
            )}
            {isCreatorAutoAssignmentOff && <AssigneeInfo formMethods={formMethods} />}
          </CardWrapper>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default GeneralInfoScreen;
