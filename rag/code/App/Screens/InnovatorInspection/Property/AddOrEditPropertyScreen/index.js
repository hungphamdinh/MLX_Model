/* eslint-disable no-shadow */
/* eslint-disable no-useless-escape */
/* eslint-disable no-new-func */
import React, { useEffect } from 'react';
import _ from 'lodash';
import { Alert } from 'react-native';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import * as Yup from 'yup';
import { FormDropdown, FormImagePicker, FormInput, FormSwitch } from '@Forms';
import { Button, Box } from '@Elements';
import BaseLayout from '@Components/Layout/BaseLayout';
import Row from '@Components/Grid/Row';
import { FormProvider } from 'react-hook-form';
import I18n from '@I18n';
import { getUniqueData, getGeneralElementsInTwoArray, removeDuplicateInTwoArray } from '../../../../Utils/array';

import styles from './styles';
import useProperty from '../../../../Context/Property/Hooks/UseProperty';
import useTeam from '../../../../Context/Team/Hooks/UseTeam';
import useUser from '../../../../Context/User/Hooks/UseUser';
import { isGranted } from '../../../../Config/PermissionConfig';
import { useCompatibleForm, useYupValidationResolver } from '../../../../Utils/hook';
import { parseStringTemplate } from '../../../../Utils/regex';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import useFeatureFlag from '../../../../Context/useFeatureFlag';

const AddOrEditPropertyScreen = ({ navigation }) => {
  const isAddNew = _.get(navigation, 'state.routeName') === 'addProperty';
  const isCreateNewInspection = navigation.getParam('isCreateNewInspection');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validationSchema = Yup.object().shape({
    propertyTypeId: Yup.string().required(requiredMessage),
    name: Yup.string().required(requiredMessage),
  });
  const {
    property: { propertyTypes, propertyDetail, propertyBuildingTypes, unitTypes, teams, districts, propertySettings },
    isLoading,
    createProperty,
    getProperties,
    uploadPropertyPhoto,
    updateProperty,
    getDetailProperty,
    deleteProperty,
    getTeamProperties,
    getDistricts,
  } = useProperty();

  const { getUsersHaveJobPicked } = useInspection();

  const { getAllTeamMembers } = useTeam();

  const {
    user: { user },
  } = useUser();
  const { isEnableLiveThere } = useFeatureFlag();

  const request = isAddNew ? createProperty : updateProperty;
  const defaultPropertyTypeId = propertyTypes.find((item) => item.isDefault)?.id;

  const title = isAddNew ? I18n.t('PROPERTY_ADD') : I18n.t('PROPERTY_UPDATE');
  const mainLayoutProps = {
    loading: isLoading,
    title,
    padding: true,
  };

  const syncFromLiveThere = propertyDetail?.source === 'LiveThere';
  const canUpdate = (propertyDetail.canUpdate && propertyDetail.source !== 'LiveThere') || isAddNew;

  let allMembers = [];
  if (teams.length > 0) {
    teams.forEach((item) => (allMembers = allMembers.concat(item.members)));
    if (_.size(propertyDetail.users) > 0) {
      // Handle when the case team is removed but still keep the assignees
      allMembers = allMembers.concat(propertyDetail.users);
    }
  } else {
    allMembers = [user];
  }
  allMembers = getUniqueData(allMembers, 'id');

  useEffect(() => {
    getListMember();
    getTeamProperties();
    getDistricts();
  }, []);

  useEffect(() => {
    if (propertyDetail && !isAddNew) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [propertyDetail]);

  useEffect(() => {
    if (propertyDetail.name && allMembers.length > 0 && !isAddNew) {
      const teamUpdated = getGeneralElementsInTwoArray(teams, propertyDetail.teams);
      handleTeamMember(teamUpdated);
      setFieldValue('teamIds', teamUpdated);
    }
  }, [propertyDetail]);

  const getListMember = (page = 1, keyword = '') => {
    getAllTeamMembers({
      page,
      keyword,
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const executeDelete = async () => {
    await deleteProperty(propertyDetail.id);
    getProperties({ page: 1 });
    navigation.pop(2);
  };

  const deleteItem = () => {
    Alert.alert(I18n.t('INSPECTION_DELETE_PROPERTY'), I18n.t('INSPECTION_DELETE_PROPERTY_MESSAGE'), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: executeDelete,
      },
    ]);
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    return {
      name: propertyDetail.name,
      floor: propertyDetail.floor,
      building: propertyDetail.building,
      district: propertyDetail.district,
      city: propertyDetail.city,
      postalCode: propertyDetail.postalCode,
      unitNumber: propertyDetail.unitNumber,
      notes: propertyDetail.notes,
      memberIds: _.map(propertyDetail.users, (item) => item.id),
      photo: propertyDetail.image,
      isActive: propertyDetail.isActive,
      propertyTypeId: _.get(propertyDetail, 'propertyType.id'),
      id: propertyDetail.id,
      street: propertyDetail.street,
      propertyUnitTypeId: propertyDetail.propertyUnitTypeId,
      propertyBuildingTypeId: propertyDetail.propertyBuildingTypeId,
      address: propertyDetail.address,
      teamIds: propertyDetail.teams,
      bedroomType: propertyDetail.bedroomType,
      removeUsers: [],
    };
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      propertyTypeId: defaultPropertyTypeId,
      name: '',
      floor: '',
      building: '',
      district: '',
      city: propertySettings?.defaultCity,
      postalCode: '',
      unitNumber: '',
      notes: '',
      isActive: true,
      memberIds: [user.id],
      photo: null,
      teamIds: [],
      bedroomType: '',
      removeUsers: [],
    },
  });

  const {
    watch,
    setFieldValue,
    formState: { isDirty },
  } = formMethods;
  const { street, district, postalCode, city, building, unitNumber, teamIds, removeUsers } = watch();
  const isActive = watch('isActive');
  const isShowDelete = isGranted('InspectionProperty.Delete') && !isActive && !isAddNew;

  React.useEffect(() => {
    if (!propertyDetail.address) {
      if (isDirty) {
        if (propertySettings.fullAddressFormat) {
          changeFullAddress({
            building,
            street,
            district,
            postalCode,
            city,
            unitNumber,
          });
        } else {
          changeAddressWithoutFormat([street, district, city, postalCode]);
        }
      }
    }
  }, [unitNumber, building, street, district, postalCode, city]);

  function addUserToListMember({ memberIds, members }) {
    const memberIdsValue = watch('memberIds');
    memberIds = members.map((member) => member.id);
    if (memberIdsValue) {
      memberIds = memberIds.concat(memberIdsValue);
    }
    return { memberIds };
  }

  const handleTeamMember = (listTeam, itemTeam) => {
    let members = [];
    let memberIds = [];

    if (!itemTeam) {
      listTeam.forEach((team) => {
        members = members.concat(team.members);
      });
      members = getUniqueData(members);
      ({ memberIds } = addUserToListMember({ memberIds, members }));
      setFieldValue('memberIds', memberIds);
    }
  };

  const onChangeAssignee = (_list, itemUnchecked) => {
    const listTeamId = [];
    if (itemUnchecked) {
      if (!isAddNew) {
        setFieldValue('removeUsers', [...removeUsers, itemUnchecked]);
      }
      if (teamIds.length > 0) {
        teamIds.forEach((team) => {
          addTeamIdsFromMembers({
            list: team.members,
            teamIds: listTeamId,
            team,
            itemUnchecked,
          });
          addTeamIdsFromMembers({
            list: team.leaders,
            teamIds: listTeamId,
            team,
            itemUnchecked,
          });
        });
        setFieldValue('teamIds', removeDuplicateInTwoArray(watch('teamIds'), listTeamId));
      }
      return;
    }
    if (!isAddNew) {
      const commonElements = removeUsers.filter((element) => _list.includes(element.id)).map((item) => item.id);
      const newRemoveUsers = removeUsers.filter((element) => !commonElements.includes(element.id));
      setFieldValue('removeUsers', newRemoveUsers);
    }
  };
  const showWarningPopUp = (users, callBack) => {
    Alert.alert(
      I18n.t('INSPECTION_REMOVE_MEMBER_WARNING_HEADER', undefined, users),
      I18n.t('INSPECTION_REMOVE_MEMBER_WARNING_ASK'),
      [
        {
          text: I18n.t('AD_COMMON_CANCEL'),
          style: 'cancel',
        },
        {
          text: I18n.t('INSPECTION_REMOVE_MEMBER_WARNING_CONTINUE'),
          onPress: () => callBack(),
        },
      ]
    );
  };

  const checkNullOrEmptyAddress = (text) => {
    let hadAddressValue = false;
    Object.keys(text).forEach((key) => {
      if (text[key]) {
        hadAddressValue = true;
      }
    });
    return hadAddressValue;
  };

  const changeFullAddress = (text) => {
    if (checkNullOrEmptyAddress(text)) {
      setFieldValue('address', parseStringTemplate(propertySettings.fullAddressFormat, text));
    } else {
      setFieldValue('address', '');
    }
  };

  const changeAddressWithoutFormat = (text) => {
    const fullAddressText = text.filter((item) => item).join(', ');
    setFieldValue('address', fullAddressText);
  };

  const addTeamIdsFromMembers = ({ list, teamIds, team, itemUnchecked }) => {
    if (list && list.length > 0) {
      list.forEach((child) => {
        if (child.teamId === team.id && itemUnchecked.id === child.id) {
          teamIds.push(team);
        }
      });
    }
  };

  const onSubmit = async ({ removeUsers, ...values }) => {
    if (_.size(removeUsers) > 0) {
      const usersPickedJob = await getUsersHaveJobPicked({
        users: removeUsers.map((item) => item.id),
        propertyId: propertyDetail?.id,
      });

      if (_.size(usersPickedJob) > 0) {
        const userName = usersPickedJob.join(',');
        showWarningPopUp(userName, () => submitRequest(values));
        return;
      }
      submitRequest(values);
      return;
    }
    submitRequest(values);
  };

  const submitRequest = async ({ teamIds, photo, removeUsers, ...values }) => {
    const result = await request({
      ...values,
      teamIds: teamIds ? teamIds.map((item) => item.id) : undefined,
      removeUsers: null,
    });

    if (result) {
      const guid = isAddNew ? result.guid : propertyDetail.guid;
      if (_.get(photo, 'file')) {
        await uploadPropertyPhoto({ guid, file: photo });
      }
      goBack();
      getProperties({ page: 1 });
      if (!isAddNew) {
        getDetailProperty(propertyDetail.id);
      }
      if (isCreateNewInspection) {
        navigation.navigate('generalInfo', { selectedProperty: result });
      }
    }
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormImagePicker disabled={!canUpdate} multiple={false} name="photo" />
          <FormInput
            required
            label={isEnableLiveThere ? 'PROPERTY_REFERENCE_NUMBER' : 'PROPERTY_NAME'}
            placeholder=""
            editable={canUpdate}
            name="name"
          />
          <FormDropdown
            disabled={!canUpdate}
            showSearchBar
            required
            options={propertyTypes}
            label="PROPERTY_TYPE"
            placeholder=""
            name="propertyTypeId"
          />
          <Box title="PROPERTY_UNIT_INFORMATION">
            <FormInput
              editable={canUpdate}
              mode="small"
              label="PROPERTY_BUILDING_TOWER"
              placeholder=""
              name="building"
            />
            <FormDropdown
              disabled={!canUpdate}
              mode="small"
              showSearchBar
              options={propertyBuildingTypes}
              label="PROPERTY_BUILDING_TYPE"
              placeholder=""
              name="propertyBuildingTypeId"
            />
            <FormInput editable={canUpdate} mode="small" label="COMMON_FLOOR" placeholder="" name="floor" />
            <FormInput
              editable={canUpdate}
              mode="small"
              label="PROPERTY_UNIT NUMBER"
              placeholder=""
              name="unitNumber"
            />
            {!syncFromLiveThere && (
              <FormDropdown
                disabled={!canUpdate}
                mode="small"
                options={unitTypes}
                showSearchBar
                label="PROPERTY_UNIT_TYPE"
                placeholder=""
                name="propertyUnitTypeId"
              />
            )}
            {syncFromLiveThere && (
              <FormInput
                editable={canUpdate}
                mode="small"
                label="PROPERTY_BEDROOM_TYPE"
                placeholder=""
                name="bedroomType"
              />
            )}
          </Box>
          <Box title="COMMON_ADDRESS">
            <FormInput editable={canUpdate} mode="small" label="COMMON_STREET" placeholder="" name="street" />
            {districts.length === 0 ? (
              <FormInput editable={canUpdate} mode="small" label="COMMON_DISTRICT" placeholder="" name="district" />
            ) : (
              <FormDropdown
                disabled={!canUpdate}
                showSearchBar
                mode="small"
                valKey="districtName"
                options={districts}
                label="COMMON_DISTRICT"
                fieldName="districtName"
                placeholder=""
                name="district"
              />
            )}

            <FormInput editable={canUpdate} mode="small" label="INSPECTION_PROPERTY_CITY" placeholder="" name="city" />
            <FormInput
              mode="small"
              editable={canUpdate}
              label="PROPERTY_POSTAL CODE"
              placeholder=""
              name="postalCode"
              keyboardType="number-pad"
            />
            <FormInput
              editable={canUpdate}
              mode="small"
              label="PROPERTY_FULL_ADDRESS"
              placeholder=""
              name="address"
              multiline
            />
          </Box>
          <FormDropdown
            disabled={!canUpdate}
            showValue={false}
            showSearchBar
            multiple
            onChange={handleTeamMember}
            options={teams}
            label="PROPERTY_ASSIGNEE_TEAM"
            placeholder=""
            name="teamIds"
          />
          <FormDropdown
            disabled={!canUpdate}
            showSearchBar
            multiple
            options={allMembers}
            onChange={onChangeAssignee}
            label="PROPERTY_ASSIGNEE_MEMBER"
            placeholder=""
            // lockValues={[user.id]}
            fieldName="displayName"
            name="memberIds"
          />
          <FormInput editable={canUpdate} label="AD_COMMON_NOTES" placeholder="" name="notes" multiline />
          <FormSwitch disabled={!canUpdate || isAddNew} label="PROPERTY_IS_ACTIVE" placeholder="" name="isActive" />
          <Row style={styles.bottomContainer}>
            {
              <Button
                rounded
                disabled={!canUpdate}
                info={!isShowDelete}
                danger={isShowDelete}
                onPress={!isShowDelete ? goBack : deleteItem}
                title={I18n.t(!isShowDelete ? 'AD_COMMON_CANCEL' : 'AD_COMMON_DELETE')}
                containerStyle={styles.bottomButton}
              />
            }
            <Button
              rounded
              disabled={!canUpdate}
              primary
              onPress={formMethods.handleSubmit(isAddNew ? submitRequest : onSubmit)}
              title={I18n.t('AD_COMMON_SAVE')}
              containerStyle={styles.bottomButton}
            />
          </Row>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddOrEditPropertyScreen;
