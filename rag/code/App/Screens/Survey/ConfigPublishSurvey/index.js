import React, { Fragment, useEffect } from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { FormDate, FormDropdown, FormInput } from '@Forms';
import * as Yup from 'yup';
import _ from 'lodash';
import moment from 'moment';
import { FormProvider } from 'react-hook-form';
import { View } from 'react-native';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import FormSegment from '../../../Components/Forms/FormSegment';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';

const ConfigPublishSurvey = ({ navigation }) => {
  const requiredField = I18n.t('COMMON_FIELD_IS_REQUIRED');
  const today = new Date();
  const validationSchema = Yup.object().shape({
    buildingIds: Yup.array().when(['notifyTo'], {
      is: (notifyTo) => _.includes([0, 1], notifyTo),
      then: Yup.array().min(1, requiredField),
    }),
    unitTypeIds: Yup.array().when(['notifyTo'], {
      is: (notifyTo) => notifyTo === 0,
      then: Yup.array().min(1, requiredField),
    }),
    tenantRoleIds: Yup.array().when(['notifyTo'], {
      is: (notifyTo) => notifyTo === 1,
      then: Yup.array().min(1, requiredField),
    }),
    startDate: Yup.string().required(requiredField),
    endDate: Yup.string().required(requiredField),
    description: Yup.string().required(requiredField),
    numOfAllowSubmit: Yup.string().when(['notifyTo'], {
      is: (notifyTo) => notifyTo === 0,
      then: Yup.string().required(requiredField),
    }),
  });

  const {
    survey: { buildings, unitTypes, tenantRoles },
    isLoading,
    getOptionsForPublishSurvey,
    getListUnitsForPublish,
    getEmailMembersForPublish,
    getListEmployeeForPublish,
  } = useSurvey();

  useEffect(() => {
    getOptionsForPublishSurvey();
  }, []);

  const onNextPress = async ({ notifyTo, startDate, endDate, numOfAllowSubmit, description, ...values }) => {
    let targetRoute = 'selectUnitToPublish';
    let result;
    if (notifyTo === 0) {
      result = await getListUnitsForPublish({
        buildingIds: values.buildingIds,
        unitTypeIds: values.unitTypeIds,
      });
    }
    if (notifyTo === 1) {
      result = await getEmailMembersForPublish({
        listBuildings: values.buildingIds,
        unitTypeIds: values.unitTypeIds,
      });
      targetRoute = 'selectTenantToPublish';
    }
    if (notifyTo === 2) {
      result = await getListEmployeeForPublish();
      targetRoute = 'selectEmployeeToPublish';
    }

    if (result) {
      navigation.navigate(targetRoute, {
        formData: {
          ...values,
          numOfAllowSubmit: _.parseInt(numOfAllowSubmit),
          startDate: moment(startDate).format(),
          endDate: moment(endDate).format(),
          description,
        },
      });
    }
  };

  const mainLayoutProps = {
    loading: isLoading,
    padding: true,
    title: I18n.t('SURVEY_PUBLISH'),
    bottomButtons: [
      {
        title: I18n.t('SURVEY_NEXT'),
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onNextPress)();
        },
      },
    ],
  };

  const getExtraField = (notifyTo) => {
    if (notifyTo === 2) return [];
    const isUnit = notifyTo === 0;
    return (
      <Fragment>
        <FormDropdown multiple showSearchBar options={buildings} label="SURVEY_BUILDING" name="buildingIds" required />
        {isUnit && (
          <Fragment>
            <FormDropdown
              multiple
              showSearchBar
              options={unitTypes}
              label="SURVEY_UNIT_TYPE"
              name="unitTypeIds"
              required
            />
            <FormInput label="SURVEY_NUM_OF_ALLOW_SUBMIT" name="numOfAllowSubmit" required keyboardType="numeric" />
          </Fragment>
        )}
        {!isUnit && (
          <FormDropdown
            multiple
            showSearchBar
            label="SURVEY_TENANT_ROLE"
            name="tenantRoleIds"
            options={tenantRoles}
            required
          />
        )}
      </Fragment>
    );
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      notifyTo: 0,
      buildingIds: [],
      unitTypeIds: [],
      tenantRoleIds: [],
      numOfAllowSubmit: '',
      startDate: undefined,
      endDate: undefined,
      description: undefined,
    },
  });

  const [notifyTo, endDate, startDate] = formMethods.watch(['notifyTo', 'endDate', 'startDate']);

  const notifyToOptions = ['SURVEY_UNIT', 'SURVEY_TENANT', 'SURVEY_USER'];

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <View>
          <AwareScrollView>
            <FormSegment values={notifyToOptions} name="notifyTo" label="SURVEY_NOTIFY_TO" />
            {getExtraField(notifyTo)}

            <FormDate label="COMMON_START_DATE" name="startDate" required minimumDate={today} maximumDate={endDate} />
            <FormDate label="COMMON_END_DATE" name="endDate" required minimumDate={startDate || today} />
            <FormInput multiline label="COMMON_DESCRIPTION" name="description" required />
          </AwareScrollView>
        </View>
      </FormProvider>
    </BaseLayout>
  );
};

export default ConfigPublishSurvey;
