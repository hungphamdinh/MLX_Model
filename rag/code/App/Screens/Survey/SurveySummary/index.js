import React, { useEffect } from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import AppList from '../../../Components/Lists/AppList';
import SurveySummaryItem from '../../../Components/Survey/SurveySummaryItem';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { PAGE_SIZE } from '../../../Config';
import { Modules } from '../../../Config/Constants';

const SurveySummary = () => {
  const {
    form: { formQuestionSummaries },
    filterFormQuestionSummary,
  } = useForm();

  useEffect(() => {
    loadData(1);
  }, []);

  const {
    survey: { surveyDetail },
  } = useSurvey();
  const mainLayoutProps = {
    title: I18n.t('SURVEY_SUMMARY'),
  };

  const loadData = async (page) => {
    filterFormQuestionSummary({
      moduleId: Modules.SURVEY,
      formId: surveyDetail.form.id,
      page,
      pageSize: PAGE_SIZE,
    });
  };

  const onItemPress = () => {};

  const listProps = {
    data: formQuestionSummaries.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: formQuestionSummaries.isRefresh,
    isLoadMore: formQuestionSummaries.isLoadMore,
    currentPage: formQuestionSummaries.currentPage,
    totalPage: formQuestionSummaries.totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => `${_.get(item, 'user.id')}`,
    renderItem: ({ item }) => <SurveySummaryItem item={item} onPress={() => onItemPress(item)} />,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default SurveySummary;
