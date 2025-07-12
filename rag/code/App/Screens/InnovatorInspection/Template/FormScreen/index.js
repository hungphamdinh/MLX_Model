/**
 * Created by thienmd on 10/7/20
 */
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';
import TemplateItem from '@Components/InnovatorInspection/TemplateItem';
import BaseLayout from '@Components/Layout/BaseLayout';
import { NavigationEvents } from '@react-navigation/compat';
import useForm from '../../../../Context/Form/Hooks/UseForm';
import AppList from '../../../../Components/Lists/AppList';
import styles from './styles';
import { FormTypes, Modules, InspectionFormOrderByColumn } from '../../../../Config/Constants';
import toast from '../../../../Utils/toast';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import TabBar from '../../../../Components/InnovatorInspection/TabBar';
import useHome from '../../../../Context/Home/Hooks/UseHome';
import { getNonOfflineInspectionProps } from '../../Inspection/InspectionHome';
import ModalChooseTeam from '../../../../Modal/ModalChooseTeam';
import Filter from '../../../../Components/Filter';
import { formatDate } from '../../../../Utils/transformData';
import { transformFormRemoteId, transformFormToEditor } from '../../../../Transforms/FormTransformer';

const FormScreen = ({ navigation }) => {
  const {
    form: { globalForms, myForms, isTeamLeader, teamForms },
    isLoading,
    getFormDetail,
    deleteForm,
    getFormCategories,
    getFormSetting,
    getTeamForms,
    getMyForms,
    getGlobalForms,
    cloneGlobalForm,
    publishToTeam,
    unPublishToTeam,
    publishToGlobal,
    cloneMyForm,
    publicForm,
  } = useForm();
  const { doSynchronize } = useSync();
  const {
    home: { isOfflineInspection },
  } = useHome();

  const isSelect = _.get(navigation, 'state.routeName') === 'selectForm';
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [keyword, setKeyword] = React.useState({ 0: '', 1: '', 2: '' });

  const getValueByTab = (...params) => params[selectedTab];

  const [publishTeamData, setPublishTeamData] = useState(undefined);
  const [visibleChooseTeam, setVisibleChooseTeam] = useState(false);
  const loadData = getValueByTab(getMyForms, getTeamForms, getGlobalForms);
  const forms = getValueByTab(myForms, teamForms, globalForms);
  const [selectedFilter, setSelectedFilter] = useState({ sortIds: [] });

  let listSorts = [
    {
      id: 1,
      type: 'id',
      isAsc: true,
      name: 'FORM_ID',
    },
    {
      id: 2,
      type: 'id',
      name: 'FORM_ID',
    },
    {
      id: 3,
      type: 'formTitle',
      isAsc: true,
      name: 'FORM_SEARCH',
    },
    {
      id: 4,
      type: 'formTitle',
      name: 'FORM_SEARCH',
    },
    {
      id: 5,
      type: 'status',
      name: 'FORM_PUBLISH_STATUS',
      isAsc: true,
    },
    {
      id: 6,
      type: 'status',
      name: 'FORM_PUBLISH_STATUS',
    },
    {
      id: 7,
      type: 'question',
      name: 'FORM_NUMBER_OF_QUESTIONS',
      isAsc: true,
    },
    {
      id: 8,
      type: 'question',
      name: 'FORM_NUMBER_OF_QUESTIONS',
    },
    {
      id: 9,
      type: 'createdBy',
      name: selectedTab === 1 ? 'FORM_PUBLISH_BY' : 'COMMON_CREATED_BY',
      isAsc: true,
    },
    {
      id: 10,
      type: 'createdBy',
      name: selectedTab === 1 ? 'FORM_PUBLISH_BY' : 'COMMON_CREATED_BY',
    },
    {
      id: 11,
      type: 'createdOn',
      name: 'COMMON_CREATED_DATE',
      isAsc: true,
    },
    {
      id: 12,
      type: 'createdOn',
      name: 'COMMON_CREATED_DATE',
    },
    {
      id: 13,
      type: 'category',
      isAsc: true,
      name: 'FORM_CATEGORY',
    },
    {
      id: 14,
      type: 'category',
      name: 'FORM_CATEGORY',
    },
  ];

  if (selectedTab === 2 || selectedTab === 1) {
    listSorts = listSorts.filter((item) => item.type !== 'status');
  }

  const filterData = {
    sortIds: {
      title: 'COMMON_SORT_BY',
      options: listSorts,
    },
  };

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    if (_.size(forms.data) === 0) {
      loadData({ page: 1, keyword: keyword[selectedTab] });
    }
  }, [selectedTab]);

  useEffect(() => {
    getList(1, keyword[selectedTab]);
  }, [keyword, selectedFilter]);

  const getList = (page = 1, text = keyword) => {
    const sortData = selectedFilter.sortIds ? selectedFilter.sortIds[0] : null;
    const params = {
      page,
      keyword: text,
    };
    if (sortData) {
      params.orderByColumn = InspectionFormOrderByColumn[sortData.type];
      params.isDescending = !sortData.isAsc;
    }
    loadData(params);
  };

  const getInitData = async () => {
    getFormSetting();
    getFormCategories();
    loadData({ page: 1, keyword: '' });
  };

  const mainLayoutProps = {
    loading: isLoading,
    showLogo: !isSelect,
    showBell: true,
    style: styles.container,
    onBtAddPress: () => {
      navigation.navigate('addForm');
    },
    addPermission: 'Form.Create',
    showAddButton: !isSelect,
    ...getNonOfflineInspectionProps(isOfflineInspection),
    title: 'INSPECTION_TAB_FORMS',
  };

  const requestFormDetail = async (id, path) => {
    const formData = await getFormDetail({ id, isEditForm: true });
    navigation.navigate(path, { formData: transformFormRemoteId(formData) });
  };

  const onItemPress = async (item) => {
    requestFormDetail(item.id, 'formDetail');
  };

  const onEditPress = async (item) => {
    requestFormDetail(item.id, 'updateForm');
  };

  const onRemovePress = async (formDetail) => {
    await deleteForm(formDetail.id);
    onRefresh();
  };

  const onPublicPress = async (isPublic, formDetail) => {
    const params = {
      formId: formDetail.id,
      isPublic,
    };
    const result = await publicForm(params);
    if (result) {
      const publishSuccess = I18n.t('FORM_PUBLISHED_SUCCESSFULLY');
      const unPublishSuccess = I18n.t('FORM_UNPUBLISHED_SUCCESSFULLY');
      toast.showSuccess(`${formDetail.formName} ${isPublic ? publishSuccess : unPublishSuccess} `);
      onRefresh();
    }
  };

  const onClonePress = async (formDetail) => {
    const formName = `${formDetail.formName}_${formatDate(new Date(), 'DD MMM YYYY')}`;
    if (selectedTab === 1 || selectedTab === 2) {
      const params = {
        formId: formDetail.id,
        formName,
        moduleId: Modules.INSPECTION,
      };
      const newForm = await cloneGlobalForm(params);
      onEditPress(newForm);
      return;
    }

    // clone my form
    const params = {
      formId: formDetail.id,
      formName,
    };
    const newForm = await cloneMyForm(params);
    onEditPress(newForm);
  };

  const onPublishGlobalPress = async (isPublish, formDetail) => {
    const params = {
      formId: formDetail.id,
      isPublish,
    };
    const result = await publishToGlobal(params);
    if (result) {
      const messMarkGlobalSuccess = I18n.t('FORM_MARK_GLOBAL_SUCCESSFULLY');
      const messUnMarkGlobalSuccess = I18n.t('FORM_UN_MARK_GLOBAL_SUCCESSFULLY');
      toast.showSuccess(`${formDetail.formName} ${isPublish ? messMarkGlobalSuccess : messUnMarkGlobalSuccess}`);
    }
    reloadAllData();
  };

  const onRefresh = () => {
    loadData({ page: 1, keyword: keyword[selectedTab] });
  };

  const reloadAllData = () => {
    getMyForms({ page: 1, keyword: keyword[0], isTeamLeader });
    getTeamForms({ page: 1, keyword: keyword[1] });
    getGlobalForms({ page: 1, keyword: keyword[2] });
  };

  const onSearch = (text) => {
    setKeyword({ ...keyword, [selectedTab]: text });
  };

  const onChangeSegmentIndex = (tabIdx) => {
    setSelectedTab(tabIdx);
  };

  const onPublishToTeam = (isPublish, form) => {
    setVisibleChooseTeam(true);
    setPublishTeamData({
      isPublish,
      form,
    });
  };

  const onPublishOrUnPublishTeamForm = async (teamIds) => {
    setVisibleChooseTeam(false);
    const params = {
      formId: publishTeamData.form.id,
      teamIds,
    };
    const submitRequest = publishTeamData.isPublish ? publishToTeam : unPublishToTeam;
    const result = await submitRequest(params);
    if (result) {
      const publishSuccess = I18n.t('FORM_PUBLISHED_SUCCESSFULLY');
      const unPublishSuccess = I18n.t('FORM_UNPUBLISHED_SUCCESSFULLY');
      toast.showSuccess(
        `${publishTeamData.form.formName} ${publishTeamData.isPublish ? publishSuccess : unPublishSuccess} `
      );
      onRefresh();
    }
    setPublishTeamData(undefined);
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };
  const listProps = {
    data: forms.data,
    numColumns: 1,
    keyword: keyword[selectedTab],
    style: styles.list,
    showsVerticalScrollIndicator: false,
    isRefresh: forms.isRefresh,
    isLoadMore: forms.isLoadMore,
    currentPage: forms.currentPage,
    totalPage: forms.totalPage,
    emptyMsg: 'INSPECTION_EMPTY_FORM_MESSAGE',
    loadData,

    renderItem: ({ item }) => (
      <TemplateItem
        {...item}
        formType={getValueByTab(FormTypes.MY_FORM, FormTypes.TEAM_FORM, FormTypes.GLOBAL_FORM)}
        isSelect={isSelect}
        isTeamLeader={isTeamLeader}
        onItemPress={() => onItemPress(item)}
        onEditPress={() => onEditPress(item)}
        onRemovePress={() => onRemovePress(item)}
        onClonePress={() => onClonePress(item)}
        onSetGlobalPress={(isPublish) => onPublishGlobalPress(isPublish, item)}
        onPublicPress={(isPublic) => onPublicPress(isPublic, item)}
        onPublishToTeamPress={(isPublish) => onPublishToTeam(isPublish, item)}
      />
    ),
    keyExtractor: (item) => `${item.id}`,
  };

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('AddOrEditFormSuccess', () => {
      setKeyword({});
      onChangeSegmentIndex(0);
      onSearch('');
      onRefresh();
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <BaseLayout {...mainLayoutProps}>
      <View style={styles.topControlContainer}>
        <TabBar
          values={[I18n.t('FORM_MY_FORM'), I18n.t('FORM_TEAM_FORM'), I18n.t('FORM_GLOBAL_FORM')]}
          selectedIndex={selectedTab}
          onChange={(index) => onChangeSegmentIndex(index)}
        />
      </View>
      <Filter
        keyword={keyword[selectedTab]}
        searchPlaceHolder="FORM_SEARCH"
        sortData={filterData}
        onSearch={onSearch}
        onSortCompleted={onApplyFilter}
        showFilter={false}
        selectedSort={selectedFilter}
      />
      <AppList {...listProps} />
      <NavigationEvents onWillFocus={doSynchronize} />
      {visibleChooseTeam && publishTeamData && (
        <ModalChooseTeam
          onClosePress={() => setVisibleChooseTeam(false)}
          onSubmit={onPublishOrUnPublishTeamForm}
          visible={visibleChooseTeam}
          publishTeamData={publishTeamData}
        />
      )}
    </BaseLayout>
  );
};
export default FormScreen;
