/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../Themes';

import ItemPM from '../../../Components/ItemApp/ItemPM';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import ListPlaceholder from '@Components/Lists/Placeholders/ListPlaceholder';
import AppList from '../../../Components/Lists/AppList';

const TabTask = ({ navigation, requestGetTaskList, taskList }) => {
  const handleOnPressTaskItem = (itemId) => {
    navigation.navigate('editPlanTask', {
      taskId: itemId,
      onUpdateSuccess: () => requestGetTaskList(),
    });
  };

  const listProps = {
    data: taskList.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    renderItem: ({ item, index }) => (
      <ItemPM item={item} index={index} onPress={() => handleOnPressTaskItem(item.id)} />
    ),
    isRefresh: taskList.isRefresh,
    loadData: ({ page }) => requestGetTaskList(page),
    isLoadMore: taskList.isLoadMore,
    currentPage: taskList.currentPage,
    totalPage: taskList.totalPage,
    keyExtractor: (item, index) => `${index}`,
    // ...props,
  };
  const renderList = () => (
    <View style={{ flex: 1 }}>
      <LoaderContainer isLoading={taskList.isRefresh} loadingComponent={<ListPlaceholder />}>
        <AppList {...listProps} />
      </LoaderContainer>
    </View>
  );

  return <View style={styles.container}>{renderList()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
});

export default TabTask;
