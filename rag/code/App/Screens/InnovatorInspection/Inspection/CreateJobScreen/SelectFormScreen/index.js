import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { DeviceEventEmitter, RefreshControl } from 'react-native';
import NavigationService from '@NavigationService';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { SearchBar } from '@Elements';
import useForm from '../../../../../Context/Form/Hooks/UseForm';
import styles from './styles';
import useInspection from '../../../../../Context/Inspection/Hooks/UseInspection';
import { DropdownItem } from '../../../../../Elements/Dropdown';
import TextWithLine from '../../../../../Elements/TextWithLine';
import AwareScrollView from '../../../../../Components/Layout/AwareScrollView';
import LoaderContainer from '../../../../../Components/Layout/LoaderContainer';
import ListPlaceholder from '../../../../../Components/Lists/Placeholders/ListPlaceholder';
import { formatDate } from '../../../../../Utils/transformData';
import EmptyListComponent from '../../../../../Components/Lists/EmptyListComponent';
import { Modules } from '../../../../../Config/Constants';
import useUser from '../../../../../Context/User/Hooks/UseUser';
import { toast } from '../../../../../Utils';
import useApp from '../../../../../Context/App/Hooks/UseApp';
import { isGranted } from '../../../../../Config/PermissionConfig';

const Title = styled(TextWithLine)`
  margin-vertical: 20px;
`;

const FirstTitle = styled(TextWithLine)`
  margin-bottom: 20px;
`;

const SelectFormScreen = ({ navigation }) => {
  const {
    createOnlineInspection,
    inspection: { inspectionSetting },
  } = useInspection();
  const {
    form: { allForms, isLoadingForms },
    getAllForms,
    cloneHiddenForm,
    publicForm,
  } = useForm();

  const {
    inspection: { defaultStatus },
  } = useInspection();

  const { user } = useUser();

  const {
    app: {
      allSettings: { general },
    },
  } = useApp();

  const [keyword, setKeyword] = useState('');

  const selectedProperty = navigation.getParam('selectedProperty');
  const generalInfo = navigation.getParam('generalInfo');
  const addPermission = 'Form.Create';

  const isPropertyLiveThere =
    _.size(selectedProperty) &&
    general?.isEnableLiveThere &&
    _.size(selectedProperty.users) > 0 &&
    selectedProperty.source === 'LiveThere';

  useEffect(() => {
    getList();
    const subscription = DeviceEventEmitter.addListener('AddOrEditFormSuccess', () => {
      getList();
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const getList = (text = keyword) => {
    const params = { page: 1, keyword: text };
    getAllForms(params);
  };

  const createInspection = async (form) => {
    let params = {
      ...generalInfo,
      inspectionPropertyId: selectedProperty?.id,
      workflow: {
        statusId: defaultStatus.id,
        formId: form.id,
        startDate: formatDate(generalInfo.startDate || new Date(), null),
        subject: form.formName,
      },
    };

    if (isPropertyLiveThere) {
      const listAssigneeIds = (selectedProperty?.users || [])
        .filter((item) => item.id && item.id !== user.user.id)
        .map((item) => item.id);
      params = {
        ...params,
        listAssigneeIds,
      };
    }

    const result = await createOnlineInspection(params, user, inspectionSetting.isCreatorAutoAssignmentOff);
    if (result) {
      toast.showSuccess(I18n.t('INSPECTION_CREATE_SUCCESSFUL'));
    }
  };

  const mainLayoutProps = {
    style: styles.container,
    title: I18n.t('INSPECTION_SELECT_FORM'),
    onLeftPress: () => {
      NavigationService.goBack();
    },
    onBtAddPress: () => {
      NavigationService.navigate('addForm', {
        createInspection,
      });
    },
    addPermission,
    showAddButton: true,
  };

  const onItemPress = async (item) => {
    if (item.isMyForm || item.isReadOnly) {
      createInspection(item);
    } else {
      cloneFormAndCreateInspection(item);
    }
  };

  const cloneFormAndCreateInspection = async (form) => {
    const params = {
      formId: form.id,
      formName: `${form.formName}_${formatDate(new Date(), 'DD MMM YYYY')}`,
      moduleId: Modules.INSPECTION,
    };
    const newForm = await cloneHiddenForm(params);
    if (newForm) {
      const publicParams = {
        formId: newForm.id,
        isPublic: true,
      };
      await publicForm(publicParams);
      createInspection(newForm);
    }
  };

  const onSearch = (text) => {
    getList(text);
    setKeyword(text);
  };

  const checkFormsLength = (key) => allForms[key]?.length !== 0;

  return (
    <BaseLayout {...mainLayoutProps}>
      <SearchBar placeholder={I18n.t('FORM_SEARCH')} onSearch={onSearch} />
      <LoaderContainer isLoading={isLoadingForms} loadingComponent={<ListPlaceholder />}>
        <AwareScrollView refreshControl={<RefreshControl refreshing={isLoadingForms} onRefresh={getList} />}>
          {!checkFormsLength('myForms') && !checkFormsLength('teamForms') && !checkFormsLength('globalForms') ? (
            <EmptyListComponent />
          ) : (
            <>
              {allForms.myForms && allForms.myForms.length > 0 && (
                <>
                  <FirstTitle text="FORM_MY_FORM" />
                  <ListForm onItemPress={onItemPress} data={allForms.myForms} />
                </>
              )}
              {allForms.teamForms && allForms.teamForms.length > 0 && isGranted(addPermission) && (
                <>
                  <Title text="FORM_TEAM_FORM" />
                  <ListForm onItemPress={onItemPress} data={allForms.teamForms} />
                </>
              )}
              {allForms.globalForms && allForms.globalForms.length > 0 && isGranted(addPermission) && (
                <>
                  <Title text="FORM_GLOBAL_FORM" />
                  <ListForm onItemPress={onItemPress} data={allForms.globalForms} />
                </>
              )}
            </>
          )}
        </AwareScrollView>
      </LoaderContainer>
    </BaseLayout>
  );
};
export default SelectFormScreen;

const ListForm = ({ data, onItemPress }) => (
  <Fragment>
    {data &&
      data.map((item) => (
        <DropdownItem
          style={styles.dropdownContainer}
          item={item}
          fieldName="formName"
          onItemPress={() => onItemPress(item)}
        />
      ))}
  </Fragment>
);
