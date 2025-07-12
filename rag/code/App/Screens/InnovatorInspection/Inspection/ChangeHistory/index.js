import React from 'react';
import styled from 'styled-components/native';
import BaseLayout from '@Components/Layout/BaseLayout';
import styles from './styles';
import I18n from '../../../../I18n';
import TabView from '../../../../Components/TabView';
import ListHistory from './ListHistory';
import FormEditorScreen from '../../Template/FormEditorScreen';
import { FormEditorTypes } from '../../../../Config/Constants';

const Wrapper = styled.View`
  margin-top: 15px;
  flex: 1;
`;

const ChangeHistory = ({ navigation }) => {
  const mainLayoutProps = {
    style: styles.container,
    title: 'INSPECTION_CHANGE_HISTORY',
  };
  const inspection = navigation.getParam('inspection');

  return (
    <BaseLayout {...mainLayoutProps}>
      <TabView>
        <Wrapper tabLabel={I18n.t('CHANGE_HISTORY_OVERVIEW')}>
          <FormEditorScreen navigation={navigation} actionType={FormEditorTypes.VIEW_HISTORY} isViewHistory />
        </Wrapper>

        <ListHistory workflow={inspection.workflow} tabLabel={I18n.t('CHANGE_HISTORY_DETAIL')} />
      </TabView>
    </BaseLayout>
  );
};
export default ChangeHistory;
