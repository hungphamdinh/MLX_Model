import React, { useEffect, useMemo, useState } from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import AppList from '../../../Components/Lists/AppList';
import SurveyRawDataItem from '../../../Components/Survey/SurveyRawDataItem';
import Filter from '../../../Components/Filter';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import { PAGE_SIZE } from '../../../Config';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { SURVEY_PUBLISHED_TYPE } from '../../../Config/Constants';
import SurveyUnitRawDataItem from '../../../Components/Survey/SurveyUnitRawDataItem';

const SurveyRawData = ({ navigation }) => {
  const {
    survey: { surveyUsers, surveyDetailId, surveyDetail, surveyUnits },
    filterSurveyUsers,
    filterSurveyUnits,
  } = useSurvey();

  const { isLoading, getUserAnswer } = useForm();

  const filterData = {
    Responded: {
      title: 'COMMON_TYPE',
      multiple: true,
      options: [
        {
          name: I18n.t('SURVEY_ONLY_RESPONDED'),
          value: 'onlyResponded',
        },
      ],
    },
  };
  const defaultFilter = { Responded: ['onlyResponded'] };
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [keyword, setKeyword] = useState('');

  const isUnitScope = useMemo(
    () => _.get(surveyDetail, 'surveyType.id') === SURVEY_PUBLISHED_TYPE.UNIT,
    [surveyDetail]
  );

  const getList = isUnitScope ? filterSurveyUnits : filterSurveyUsers;
  const list = isUnitScope ? surveyUnits : surveyUsers;
  const searchPlaceHolder = isUnitScope ? 'COMMON_KEYWORD' : 'SURVEY_RAW_DATA_PLACEHOLDER_SEARCH';

  useEffect(() => {
    loadData(1);
  }, [keyword, selectedFilter]);

  const onTextSearchChange = (text) => {
    setKeyword(text);
  };

  const loadData = (page) => {
    getList({
      surveyId: surveyDetailId,
      keyword,
      page,
      pageSize: PAGE_SIZE,
      isSubmitted: _.size(selectedFilter.Responded) > 0,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const mainLayoutProps = {
    loading: isLoading,
    title: I18n.t('SURVEY_RAW_DATA'),
    navigation,
  };

  const onItemPress = async (responseId) => {
    const formData = await getUserAnswer(responseId);
    navigation.navigate('employeeSurveyDetail', { formData });
  };

  const renderItem = ({ item }) => {
    if (isUnitScope) {
      return <SurveyUnitRawDataItem item={item} onPress={onItemPress} />;
    }
    return <SurveyRawDataItem item={item} onPress={() => onItemPress(item.formUserAnswer.id)} />;
  };

  const listProps = {
    data: list.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: list.isRefresh,
    isLoadMore: list.isLoadMore,
    currentPage: list.currentPage,
    totalPage: list.totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => `${_.get(item, 'user.id')}`,
    renderItem,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder={searchPlaceHolder}
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default SurveyRawData;
