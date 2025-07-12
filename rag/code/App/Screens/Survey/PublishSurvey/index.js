import React from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import { Text } from '@Elements';
import styled from 'styled-components/native';

import AppList from '../../../Components/Lists/AppList';
import {
  PublishSurveyToEmployeeItem,
  PublishSurveyToTenantItem,
  PublishSurveyToUnitItem,
} from '../../../Components/Survey/PublishSurveyItem';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import ListModel from '../../../Context/Model/ListModel';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';

const TotalRecord = styled(Text)`
  margin-top: 20px;
  margin-bottom: 5px;
  margin-left: 12px;
`;

const routeNames = {
  PublishSurveyToUnit: 'publishSurveyToUnit',
  PublishSurveyToTenant: 'publishSurveyToTenant',
  PublishSurveyToEmployee: 'publishSurveyToEmployee',
};

const PublishSurvey = ({ navigation }) => {
  const {
    survey: { surveyDetailId },
    isLoading,
    publicSurvey,
  } = useSurvey();
  const routeName = _.get(navigation, 'state.routeName');
  const formData = navigation.getParam('formData');
  const list = navigation.getParam('list');

  const getValueByType = (byUnit, byTenant, byEmployee) => {
    if (routeName === routeNames.PublishSurveyToTenant) {
      return byTenant;
    }
    if (routeName === routeNames.PublishSurveyToEmployee) {
      return byEmployee;
    }
    return byUnit;
  };

  const data = getValueByType(list, list, list);
  const listData = new ListModel();
  listData.setData({
    items: data,
  });

  const ListItem = getValueByType(PublishSurveyToUnitItem, PublishSurveyToTenantItem, PublishSurveyToEmployeeItem);

  const onPublishPress = () => {
    const params = {
      ...formData,
      id: surveyDetailId,
      surveyTypeId: getValueByType(2, 1, 3),
      unitIds: getValueByType(
        list.map((item) => item.id),
        [],
        []
      ),
      userIds: getValueByType(
        [],
        _.map(list, (member) => member.id),
        _.map(list, (member) => member.id)
      ),
    };
    publicSurvey(params);
    // {"id":126,
    //   "userIds":[],
    //   "unitIds":[4468,4469,4470,4471,4472,4473,4474,4475,4476,4477,4478,5029,5214,5030],
    //   "startDate":"2021-05-17T03:19:55.000Z",
    //   "endDate":"2021-05-19T03:19:55.000Z",
    //   "description":"rer",
    //   "numOfAllowSubmit":1,
    //   "surveyTypeId":2}
  };

  const mainLayoutProps = {
    loading: isLoading,
    title: I18n.t('SURVEY_PUBLISH'),
    bottomButtons: [
      {
        title: I18n.t('SURVEY_PUBLISH'),
        type: 'primary',
        disabled: data.length === 0,
        onPress: onPublishPress,
      },
    ],
  };

  const listProps = {
    data: listData.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: listData.isRefresh,
    isLoadMore: listData.isLoadMore,
    currentPage: listData.currentPage,
    totalPage: listData.totalPage,
    loadData: () => {},
    keyExtractor: (item) => `${_.get(item, 'id')}`,
    renderItem: ({ item, index }) => <ListItem item={item} type={routeName} id={index + 1} />,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <TotalRecord preset="medium">
        {I18n.t('SURVEY_TOTAL_RECORD')}: {data.length}{' '}
      </TotalRecord>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default PublishSurvey;
