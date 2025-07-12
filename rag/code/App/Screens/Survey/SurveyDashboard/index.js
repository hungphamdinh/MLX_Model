import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { DeviceEventEmitter } from 'react-native';
import AppList from '../../../Components/Lists/AppList';
import Filter from '../../../Components/Filter';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import { PAGE_SIZE } from '../../../Config';
import ItemSurveyDashboard from '../../../Components/ItemApp/ItemSurveyDashboard';
import { Modules } from '../../../Config/Constants';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';

const SurveyDashboard = ({ navigation }) => {
  const {
    survey: { surveys },
    filterSurvey,
    getSurveyDetail,
  } = useSurvey();

  const { getQuestionTypes } = useInspection();

  const filterData = {
    include: {
      title: 'SURVEY_INCLUDE',
      multiple: true,
      options: [
        {
          name: I18n.t('SURVEY_EXPIRED'),
          id: 'includeExpired',
        },
        {
          name: I18n.t('SURVEY_ARCHIVED'),
          id: 'includeArchived',
        },
      ],
    },
  };
  const defaultFilter = {
    include: [],
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    getQuestionTypes(Modules.SURVEY);
  }, []);

  useEffect(() => {
    loadData(1);
  }, [keyword, selectedFilter]);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('SurveyDashboardUpdated', () => {
      loadData(1);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const onTextSearchChange = (text) => {
    setKeyword(text);
  };

  const getValueFilter = (name) => _.includes(selectedFilter.include, name);

  const loadData = (page) => {
    filterSurvey({
      sorting: 'id',
      keyword,
      page,
      pageSize: PAGE_SIZE,
      includeExpired: getValueFilter('includeExpired'),
      includeArchived: getValueFilter('includeArchived'),
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onItemPress = (item) => {
    getSurveyDetail(item.id);
    navigation.navigate('surveyDetail');
  };

  const baseLayoutProps = {
    showBell: true,
    title: I18n.t('SURVEY_MODULE_TITLE'),
    onBtAddPress: () => {
      navigation.navigate('addSurvey');
    },
    showAddButton: true,
    addPermission: 'Survey.Create',
  };

  const listProps = {
    data: surveys.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: surveys.isRefresh,
    isLoadMore: surveys.isLoadMore,
    currentPage: surveys.currentPage,
    totalPage: surveys.totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => <ItemSurveyDashboard item={item} onPress={() => onItemPress(item)} />,
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder="SURVEY_PLACEHOLDER_SEARCH"
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};
export default SurveyDashboard;
