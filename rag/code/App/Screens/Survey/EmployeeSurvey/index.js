import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import { DeviceEventEmitter } from 'react-native';
import BaseLayout from '@Components/Layout/BaseLayout';
import AppList from '../../../Components/Lists/AppList';
import Separator from '../../../Components/ListItem/Separator';
import Filter from '../../../Components/Filter';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import { PAGE_SIZE } from '../../../Config';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { Modules } from '../../../Config/Constants';
import useUser from '../../../Context/User/Hooks/UseUser';
import { AlertNative } from '../../../Components';
import ItemSurveyEmployee from '../../../Components/ItemApp/ItemSurveyEmployee';

const EmployeeSurvey = ({ navigation }) => {
  const isSubmitted = navigation.getParam && navigation.getParam('isSubmitted');

  const {
    survey: { employeeSurveys },
    filterSurveyResponse,
  } = useSurvey();
  const {
    user: { user },
  } = useUser();

  const { getFormDetail, reopenFormUserAnswer, isLoading, getUserAnswer } = useForm();

  const filterData = {
    Submit: {
      title: 'COMMON_STATUS',
      multiple: false,
      options: [
        {
          name: I18n.t('SURVEY_SUBMITTED'),
          id: true,
        },
        {
          name: I18n.t('SURVEY_NOT_YET_SUBMITTED'),
          id: false,
        },
      ],
    },
  };

  const defaultFilter = {
    Submit: [undefined],
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadData(1);
    // setTimeout(() => {
    //   onItemPress({id: 121});
    // }, 600);
  }, [keyword, selectedFilter]);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('EmployeeSurveyUpdated', () => {
      loadData(1);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (isSubmitted !== undefined) {
      selectedFilter.Submit = [isSubmitted];
      setSelectedFilter({ ...selectedFilter });
    }
  }, [isSubmitted]);

  const onSearch = (text) => {
    setKeyword(text);
  };

  const loadData = (page) => {
    filterSurveyResponse({
      sorting: 'id',
      keyword,
      IncludeArchived: true,
      orderByColumn: 0,
      isDescending: true,
      isSubmitted: _.first(selectedFilter.Submit),
      page,
      pageSize: PAGE_SIZE,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onItemPress = async (item) => {
    if (item.isSubmitted) {
      const formData = await getUserAnswer(item.id);
      navigation.navigate('employeeSurveyDetail', { formData, moduleId: Modules.SURVEY });
    } else {
      const formData = await getFormDetail({ id: item.formId });
      navigation.navigate('employeeSurveyEditor', { formData, survey: item, moduleId: Modules.SURVEY });
    }
  };

  const onReopen = async (item) => {
    const executeReopen = async () => {
      await reopenFormUserAnswer({
        parentId: item.surveyId,
        moduleId: Modules.SURVEY,
        userId: user.id,
        formUserAnswerId: item.id,
      });
    };
    AlertNative(
      I18n.t('SURVEY_REOPEN_CONFIRM_TITLE'),
      I18n.t('SURVEY_REOPEN_CONFIRM_SUBTITLE'),
      executeReopen,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  const mainLayoutProps = {
    loading: isLoading,
    title: I18n.t('AD_HOME_EMPLOYEE_SURVEY'),
    navigation,
    // extraView: (
    //   <ExtraView>
    //     <SearchBar placeholder={I18n.t('COMMON_SEARCH')} onSearch={onSearch} style={{ flex: 1, marginVertical: 0 }} />
    //     <Filter
    //       data={filterData}
    //       defaultFilter={defaultFilter}
    //       onCompleted={onApplyFilter}
    //       selectedFilter={selectedFilter}
    //     />
    //   </ExtraView>
    // ),
  };

  const listProps = {
    data: employeeSurveys.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    ItemSeparatorComponent: () => <Separator />,
    isRefresh: employeeSurveys.isRefresh,
    isLoadMore: employeeSurveys.isLoadMore,
    currentPage: employeeSurveys.currentPage,
    totalPage: employeeSurveys.totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => `${item.id}-${item.surveyId}`,
    renderItem: ({ item }) => (
      <ItemSurveyEmployee item={item} onPress={() => onItemPress(item)} onReopen={() => onReopen(item)} />
    ),
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onSearch}
        searchPlaceHolder="EMPLOYEE_SURVEY_PLACEHOLDER_SEARCH"
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};
export default EmployeeSurvey;
