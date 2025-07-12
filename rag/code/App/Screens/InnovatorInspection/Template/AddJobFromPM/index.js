import React, { useEffect } from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import { View } from 'react-native-animatable';
import styled from 'styled-components/native';
import { FormProvider } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import useForm from '../../../../Context/Form/Hooks/UseForm';
import {
  FormCheckBox,
  FormDate,
  FormInput,
  FormLazyDropdown,
  FormDropdown,
  FormRadioGroup,
} from '../../../../Components/Forms';
import BaseLayout from '../../../../Components/Layout/BaseLayout';
import { Card } from '../../../../Elements';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import { useCompatibleForm, useYupValidationResolver } from '../../../../Utils/hook';
import TabBar from '../../../../Components/InnovatorInspection/TabBar';
import { formatDate } from '../../../../Utils/transformData';
import useTeam from '../../../../Context/Team/Hooks/UseTeam';
import { isSGBundleID, isUatBundleId } from '../../../../Config';

const FormType = {
  myForm: 1,
  teamForm: 2,
};

const CardContainer = styled(Card)`
  margin-top: 20px;
`;
const AddJobFromPM = ({ navigation }) => {
  const routeParams = useRoute().params;
  const [selectedTab, setSelectedTab] = React.useState(0);

  const moduleId = routeParams?.moduleId;
  const linkId = routeParams?.linkId;
  const assets = routeParams?.assets;

  const validationMapSchema = Yup.object().shape({
    inspection: Yup.object().nullable().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
  });

  const {
    form: { formsLinkByModule },
    getFormsByLinkModule,
  } = useForm();

  const {
    team: { teamInspectionLinkages },
    getTeamsPMLinkage,
  } = useTeam();

  const {
    isLoading,
    inspection: { inspectionsLinkModule },
    createInspectionLinkage,
    linkInspection,
    getInspectionsByLinkModule,
  } = useInspection();

  const isMapExist = selectedTab === 0;
  const isShowAssigneeTeam = teamInspectionLinkages.length > 1;

  const validationCreateSchema = Yup.object().shape({
    subject: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    form: Yup.object().nullable().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    startDate: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    teamId: isShowAssigneeTeam ? Yup.number().nullable().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')) : null,
  });

  const create = isMapExist ? linkInspection : createInspectionLinkage;

  const getList = (page = 1, keyword, isJob = isMapExist, isOwner = true) => {
    const getData = isJob ? getInspectionsByLinkModule : getFormsByLinkModule;
    let params = {};
    const commonParams = {
      page,
      keyword,
      linkageModule: moduleId,
      isOwner,
    };
    if (isJob) {
      params = {
        ...commonParams,
        linkageModuleId: moduleId,
      };
    } else {
      params = {
        ...commonParams,
        linkageModule: moduleId,
      };
    }
    getData(params);
  };

  useEffect(() => {
    getList(1, '');
    getList(1, '', false, isSGBundleID || isUatBundleId);
    getTeamsPMLinkage();
  }, []);

  useEffect(() => {
    if (teamInspectionLinkages.length === 1) {
      formMethods.setFieldValue('teamId', teamInspectionLinkages[0].id);
    }
  }, [teamInspectionLinkages.length]);

  const onSubmit = async ({ isComplete, subject, form, startDate, teamId, ...values }) => {
    const onAddSuccess = navigation.getParam('onAddSuccess');

    let inspection = {
      workflow: {
        subject,
        formId: form?.id,
        startDate: formatDate(startDate, null),
      },
      assets: _.map(assets, (item) => ({
        id: item.id,
        assetId: item.id,
        locationId: item.location?.id,
      })),
    };
    if (teamInspectionLinkages.length > 0) {
      inspection = {
        ...inspection,
        teamId,
      };
    }
    let params = {
      linkId,
      isComplete,
      moduleId,
    };

    if (isMapExist) {
      params = {
        ...params,
        inspectionId: values.inspection.id,
      };
    } else {
      params = {
        ...params,

        inspection,
      };
    }
    const res = await create(params);
    if (res) {
      navigation.goBack();
      onAddSuccess();
    }
  };

  const onChangeSegmentIndex = (tabIdx) => {
    setSelectedTab(tabIdx);
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(isMapExist ? validationMapSchema : validationCreateSchema),
    defaultValues: {
      subject: '',
      description: '',
      isPublish: false,
      formPages: [],
      form: null,
      startDate: undefined,
      isComplete: false,
      inspection: null,
      teamId: teamInspectionLinkages.length === 1 ? teamInspectionLinkages[0] : null,
      formType: isSGBundleID || isUatBundleId ? [FormType.myForm] : [FormType.teamForm],
    },
  });

  const mainLayoutProps = {
    title: I18n.t('INSPECTION_ADD_JOB'),
    bottomButtons: [
      {
        title: I18n.t('AD_COMMON_SAVE'),
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
    loading: isLoading,
  };

  const formTypes = [
    {
      label: I18n.t('FORM_MY_FORM'),
      value: FormType.myForm,
    },
    {
      label: I18n.t('FORM_TEAM_FORM'),
      value: FormType.teamForm,
    },
  ];
  const { setFieldValue, watch } = formMethods;
  const formType = watch('formType');

  return (
    <BaseLayout {...mainLayoutProps}>
      <View>
        <TabBar
          values={[I18n.t('INSPECTION_MAP_INSPECTION'), I18n.t('INSPECTION_CREATE_NEW_INSPECTION')]}
          selectedIndex={selectedTab}
          onChange={(index) => onChangeSegmentIndex(index)}
        />
      </View>
      <FormProvider {...formMethods}>
        <CardContainer>
          {!isMapExist ? (
            <>
              <FormInput required label="INSPECTION_JOB_NAME" maxLength={200} name="subject" mode="small" />
              <FormRadioGroup
                required
                mode="small"
                horizontal
                options={formTypes}
                label="FORM_NAME"
                name="formType"
                onChange={(val) => {
                  setFieldValue('form', null);
                  getList(1, '', false, val[0] === FormType.myForm);
                }}
              />
              <FormLazyDropdown
                required
                listExist={formsLinkByModule.data}
                isDropdownItem
                mode="small"
                showSearchBar
                getList={(page, key) => getList(page, key, false, formType[0] === FormType.myForm)}
                options={formsLinkByModule}
                title="FORM_NAME"
                fieldName="formName"
                titleKey="formName"
                name="form"
              />
              {isShowAssigneeTeam && (
                <FormDropdown
                  showSearchBar
                  options={teamInspectionLinkages}
                  label="INSPECTION_ASSIGNEE_TEAM_LINKAGE"
                  placeholder=""
                  required
                  mode="small"
                  name="teamId"
                />
              )}
              <FormDate required small overflow={false} label={I18n.t('INSPECTION_PLANNED_DATE')} name="startDate" />
            </>
          ) : (
            <FormLazyDropdown
              listExist={inspectionsLinkModule.data}
              isDropdownItem
              mode="small"
              showSearchBar
              getList={(page, key) => getList(page, key, true)}
              options={inspectionsLinkModule}
              title="INSPECTION_INSPECTION_JOB"
              label="INSPECTION_INSPECTION_JOB"
              fieldName="name"
              titleKey="name"
              name="inspection"
            />
          )}
          <FormCheckBox label="INSPECTION_CHECK_BOX_COMPLETED_PM" name="isComplete" />
        </CardContainer>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddJobFromPM;
