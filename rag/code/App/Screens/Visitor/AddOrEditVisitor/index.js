import React, { useEffect } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import moment from 'moment';
import BaseLayout from '@Components/Layout/BaseLayout';
import { FormDate, FormDocumentPicker, FormDropdown, FormInput } from '@Components/Forms';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import useVisitor from '@Context/Visitor/Hooks/UseVisitor';
import Row from '@Components/Grid/Row';
import { useYupValidationResolver } from '@Utils/hook';
import { Box } from '@Elements';
import FormSuggestionPicker, { SuggestionTypes } from '@Components/Forms/FormSuggestionPicker';
import VisitorInformationBox from '@Components/Visitor/VisitorInformationBox';
import LocaleConfig from '@Config/LocaleConfig';
import useUser from '@Context/User/Hooks/UseUser';
import useFile from '@Context/File/Hooks/UseFile';
import { FormRadioGroup, FormDisabledProvider } from '@Forms';
import { getCompanyRepresentativeName } from '../../../Utils/common';
import { View } from 'react-native';

const RowWrapper = styled(Row)`
  flex-wrap: wrap;
  justify-content: space-between;
`;

const DateWrapper = styled.View`
  width: 49%;
`;

const ActualColumn = styled.View`
  flex: 1;
`;

const AddOrEditVisitor = ({ navigation }) => {
  const {
    visitor: { types, visitorDetail },
    isLoading,
    getVisitorReasons,
    addVisitor,
    editVisitor,
  } = useVisitor();

  const {
    user: { tenant, isOfficeSite },
  } = useUser();

  const {
    file: { fileUrls },
    getFileReference,
  } = useFile();

  const isAddNew = _.get(navigation, 'state.routeName') === 'addVisitor';

  const submitRequest = isAddNew ? addVisitor : editVisitor;
  const title = isAddNew ? 'VS_NEW' : 'VS_EDIT';
  const isDeactivate = !visitorDetail?.isActive && !isAddNew;

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validateVisitorInfo = (key, array, path, createError) => {
    const data = array.filter((item, index) => array.length > 0 && index === 0 && !item.key)[0];
    const haveData = data ? data[key] : false;
    return haveData || createError({ path: `${path}.${0}.${key}`, message: requiredMessage });
  };

  const validationSchema = Yup.object().shape({
    unit: Yup.object().when([], {
      is: () => !isOfficeSite,
      then: Yup.object().required(requiredMessage),
    }),
    company: Yup.object().when([], {
      is: () => isOfficeSite,
      then: Yup.object().required(requiredMessage),
    }),
    reasonForVisit: Yup.string().required(requiredMessage),
    numberOfVisitors: Yup.number().required(requiredMessage).min(1, I18n.t('COMMON_VALIDATE_POSITIVE')),
    visitorInformations: Yup.array()
      .test('visitorInformations', requiredMessage, function () {
        return validateVisitorInfo('name', this.parent.visitorInformations, this.path, this.createError);
      })
      .test('visitorInformations', requiredMessage, function () {
        return validateVisitorInfo('phone', this.parent.visitorInformations, this.path, this.createError);
      }),
    companyName: Yup.string().when([], {
      is: () => !isAddNew && visitorDetail.location,
      then: Yup.string().required(requiredMessage),
    }),
  });

  useEffect(() => {
    if (_.size(types) === 0) {
      getVisitorReasons();
    }
  }, [types]);

  useEffect(() => {
    if (visitorDetail) {
      getFileReference(visitorDetail.guid);
    }
  }, [visitorDetail]);

  useEffect(() => {
    if (!isAddNew) {
      setValue('files', fileUrls);
    }
  }, [fileUrls.length]);

  const onSubmit = async (values) => {
    const {
      files,
      registerTime,
      registerCheckOutTime,
      reasonForVisit,
      unit,
      checkInTimes,
      checkOutTimes,
      visitorType,
      company,
      ...restValues
    } = values;
    const checkInTime = registerTime ? moment(registerTime, LocaleConfig.dateTimeFormat).toDate() : registerTime;
    const checkOutTime = registerCheckOutTime
      ? moment(registerCheckOutTime, LocaleConfig.dateTimeFormat).toDate()
      : registerCheckOutTime;

    const uploadFiles = files.filter((item) => item.path);

    const params = {
      ...restValues,
      ...unit,
      fullUnitId: unit?.fullUnitCode,
      username: unit?.displayName,
      tenantId: tenant.id,
      registerTime: checkInTime,
      registerCheckOutTime: checkOutTime,
      reasonForVisit: { id: reasonForVisit },
      checkInTimes: checkInTimes.filter((item) => item.value),
      checkOutTimes: checkOutTimes.filter((item) => item.value),
      files: uploadFiles,
      visitorType: visitorType[0],
      companyId: company?.id,
      isOffice: isOfficeSite,
    };
    const result = await submitRequest(params);
    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListVisitor');
    }
  };

  const formatVisitorDateTime = (dateStr) => (dateStr ? moment(dateStr).toDate() : undefined);

  const getInitialValuesForUpdate = () => {
    if (isAddNew || !visitorDetail) {
      return {};
    }

    const unit = {
      id: visitorDetail.unitId,
      fullUnitCode: visitorDetail.fullUnitId,
      displayName: visitorDetail.username,
    };

    const company = {
      id: visitorDetail.companyId,
      companyRepresentative: getCompanyRepresentativeName(visitorDetail.company),
    };

    const visitorType = [visitorDetail.visitorType];

    // remove empty checkInTimes and checkOutTimes to get default value
    if (_.size(visitorDetail.checkInTimes) === 0) {
      delete visitorDetail.checkInTimes;
    }

    if (_.size(visitorDetail.checkOutTimes) === 0) {
      delete visitorDetail.checkOutTimes;
    }

    return {
      ...visitorDetail,
      registerTime: formatVisitorDateTime(visitorDetail.registerTime),
      registerCheckOutTime: formatVisitorDateTime(visitorDetail.registerCheckOutTime),
      reasonForVisit: visitorDetail.reasonForVisit.id,
      visitorType,
      unit,
      company,
      locationName: visitorDetail.location?.name,
    };
  };

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      registerTime: undefined,
      registerCheckOutTime: undefined,
      description: '',
      reasonForVisit: undefined,
      numberOfVisitors: 0,
      visitorInformations: [{}],
      files: [],
      checkInTimes: [
        {
          value: null,
          visitorId: null,
        },
      ],
      checkOutTimes: [
        {
          value: null,
          visitorId: null,
        },
      ],
      visitorType: [0],
      ...getInitialValuesForUpdate(),
    },
  });

  const { setValue } = formMethods;

  const { fields: checkInTimes } = useFieldArray({
    control: formMethods.control,
    name: 'checkInTimes',
    keyName: 'uniqueId',
  });

  const { fields: checkOutTimes } = useFieldArray({
    control: formMethods.control,
    name: 'checkOutTimes',
    keyName: 'uniqueId',
  });

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        permission: !isAddNew && 'Visitors.Update',
        onPress: formMethods.handleSubmit(onSubmit),
        disabled: isDeactivate,
      },
    ],
  };

  if (!visitorDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  const dateProps = {
    mode: 'datetime',
    small: true,
  };

  const visitorTypes = [
    {
      label: I18n.t('VISITOR_TYPE_VISITOR'),
      value: 0,
    },
    {
      label: I18n.t('VISITOR_TYPE_CONTRACTOR'),
      value: 1,
    },
  ];

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormDisabledProvider disabled={isDeactivate}>
        <FormProvider {...formMethods}>
          <AwareScrollView>
            {!isAddNew && visitorDetail.location && (
              <View>
                <FormInput name="locationName" label="LOCATION" editable={false} placeholder="LOCATION" />
                <FormInput required name="companyName" label="COMPANY_NAME" placeholder="COMPANY_NAME" />
              </View>
            )}
            {(isAddNew ? !isOfficeSite : !!visitorDetail.unitId) && (
              <FormSuggestionPicker
                required
                label="AD_CRWO_TITLE_UNIT_LOCATION"
                placeholder="AD_CRWO_TITLE_UNIT_LOCATION"
                name="unit"
                type={SuggestionTypes.UNIT}
                disabled={!isAddNew}
              />
            )}
            {(isAddNew ? isOfficeSite : !!visitorDetail.companyId) && (
              <FormSuggestionPicker
                required
                label="COMPANY"
                placeholder="COMPANY"
                name="company"
                type={SuggestionTypes.COMPANY_REPRESENTATIVE}
                disabled={!isAddNew}
              />
            )}
            <FormRadioGroup required options={visitorTypes} label="VISITOR_TYPE" name="visitorType" />

            <FormInput
              required
              label="VS_NUM_OF_VISITOR"
              placeholder="VS_NUM_OF_VISITOR"
              name="numberOfVisitors"
              keyboardType="number-pad"
            />
            <VisitorInformationBox formMethods={formMethods} />
            <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
              <RowWrapper>
                <DateWrapper>
                  <FormDate
                    {...dateProps}
                    label="VS_NEW_INFO_TIME1"
                    placeholder="VS_NEW_INFO_TIME1"
                    name="registerTime"
                  />
                </DateWrapper>
                <DateWrapper>
                  <FormDate {...dateProps} label="VS_NEW_INFO_TIME2" name="registerCheckOutTime" />
                </DateWrapper>
              </RowWrapper>
            </Box>
            <Box title="VISITOR_ACTUAL_CHECK_IN_OUT">
              <Row>
                <ActualColumn>
                  {checkInTimes.map((item, index) => (
                    <FormDate
                      key={item.uniqueId}
                      label={index === 0 ? 'VISITOR_ACTUAL_CHECK_IN' : ''}
                      {...dateProps}
                      name={`checkInTimes.${index}.value`}
                    />
                  ))}
                </ActualColumn>
                <ActualColumn>
                  {checkOutTimes.map((item, index) => (
                    <FormDate
                      key={item.uniqueId}
                      label={index === 0 ? 'VISITOR_ACTUAL_CHECK_OUT' : ''}
                      {...dateProps}
                      name={`checkOutTimes.${index}.value`}
                    />
                  ))}
                </ActualColumn>
              </Row>
            </Box>
            {isDeactivate && <FormInput label="COMMON_REASON" placeholder="" name="reason" editable={false} />}

            <FormDropdown
              required
              options={types}
              label="VISITOR_PURPOSE_OF_VISIT"
              placeholder=""
              name="reasonForVisit"
            />
            <FormInput label="FB_PROBLEM" placeholder="" name="description" multiline />
            <FormDocumentPicker name="files" label="COMMON_DOCUMENT" />
          </AwareScrollView>
        </FormProvider>
      </FormDisabledProvider>
    </BaseLayout>
  );
};

export default AddOrEditVisitor;
