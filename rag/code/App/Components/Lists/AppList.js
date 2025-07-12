/**
 * Created by thienmd on 10/15/20
 */
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Footer from './Footer';
import EmptyComponent from './EmptyListComponent';
import LoaderContainer from '../Layout/LoaderContainer';
import ListPlaceholder from './Placeholders/ListPlaceholder';
// import { EmptyItemList, PlaceHolderItemH } from '@components';

const AppList = (props) => {
  const {
    isRefresh,
    isLoadMore,
    data,
    currentPage,
    totalPage,
    emptyMsg,
    loadData,
    keyword = '',
    emptyComponent,
    ...restProps
  } = props;
  const onLoadMore = () => {
    if (currentPage < totalPage) {
      loadData({ page: currentPage + 1, keyword });
    }
  };

  const listProps = {
    data,
    scrollsToTop: false,
    extraData: isRefresh,
    showsVerticalScrollIndicator: false,
    legacyImplementation: false,
    contentContainerStyle: styles.contentContainer,
    onRefresh: () => loadData({ page: 1, keyword }),
    refreshing: isRefresh,
    onEndReachedThreshold: 0.5,
    onEndReached: onLoadMore,
    ListFooterComponent: () => <Footer loadMore={isLoadMore} />,
    ListEmptyComponent: () => emptyComponent || <EmptyComponent emptyMsg={emptyMsg} />,
    ...restProps,
  };

  return (
    <LoaderContainer isLoading={isRefresh} loadingComponent={<ListPlaceholder />}>
      <FlatList {...listProps} />
    </LoaderContainer>
  );
};

export default AppList;

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 80,
    paddingTop: 20,
  },
});
