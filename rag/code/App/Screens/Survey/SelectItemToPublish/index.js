import React from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import { FormDropdown, FormRadioGroup } from '../../../Components/Forms';
import { useYupValidationResolver } from '../../../Utils/hook';

const routeNames = {
  SelectUnitToPublish: 'selectUnitToPublish',
  SelectTenantToPublish: 'selectTenantToPublish',
  SelectEmployeeToPublish: 'selectEmployeeToPublish',
};

const SelectItemToPublish = ({ navigation }) => {
  const {
    survey: { units, employees, members },
    isLoading,
  } = useSurvey();

  const routeName = _.get(navigation, 'state.routeName');
  const formData = navigation.getParam('formData');
  let targetRoute = 'publishSurveyToUnit';

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    list: Yup.array()
      .nullable()
      .test('List err', requiredMessage, function (value) {
        const createType = this.parent.createType[0];
        return !(createType === 1 && value.length === 0);
      }),
  });

  const getValueByType = (byUnit, byTenant, byEmployee) => {
    if (routeName === routeNames.SelectTenantToPublish) {
      targetRoute = 'publishSurveyToTenant';
      byTenant.map((item) => {
        item.text = item.displayName;
        item.id = item.userId;
        return null;
      });
      return byTenant;
    }
    if (routeName === routeNames.SelectEmployeeToPublish) {
      targetRoute = 'publishSurveyToEmployee';
      byEmployee.map((item) => (item.text = item.displayName));
      return byEmployee;
    }
    byUnit.map((item) => (item.text = item.fullUnitCode));
    return byUnit;
  };

  const addOptions = [
    {
      label: I18n.t('SURVEY_SELECT_ALL'),
      value: 0,
    },
    {
      label:
        routeName === routeNames.SelectTenantToPublish
          ? I18n.t('SURVEY_SELECT_TENANT')
          : routeName === routeNames.SelectEmployeeToPublish
          ? I18n.t('SURVEY_SELECT_EMPLOYEE')
          : I18n.t('SURVEY_SELECT_UNIT'),
      value: 1,
    },
  ];

  const data = getValueByType(units, members, employees);

  const onPressNext = ({ list, createType }) => {
    let lisData = list;
    if (createType[0] === 0) {
      lisData = data;
    }
    navigation.navigate(targetRoute, {
      formData,
      list: lisData,
    });
  };

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      list: [],
      createType: [0],
    },
  });
  const mainLayoutProps = {
    loading: isLoading,
    padding: true,
    title: I18n.t('SURVEY_PUBLISH'),
    bottomButtons: [
      {
        title: I18n.t('COMMON_NEXT'),
        type: 'primary',
        disabled: data.length === 0,
        onPress: () => {
          formMethods.handleSubmit(onPressNext)();
        },
      },
    ],
  };

  const { watch } = formMethods;
  const createType = watch('createType');
  return (
      <BaseLayout {...mainLayoutProps}>
          <AwareScrollView>
              <FormProvider {...formMethods}>
                  <FormRadioGroup options={addOptions} label="SURVEY_SELECT_WAY_PUBLISH" name="createType" />
                  {_.first(createType) === 1 && (
                  <FormDropdown
                    label="SURVEY_SELECTED_LIST"
                    showSearchBar
                    required
                    showCheckAll
                    multiple
                    name="list"
                    options={data}
                    fieldName="text"
                    showValue={false}
                  />
          )}
              </FormProvider>
          </AwareScrollView>
      </BaseLayout>
  );
};

export default SelectItemToPublish;
