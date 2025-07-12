/* @flow */

import React, { PureComponent } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import I18n from '@I18n';
import _ from 'lodash';
import { SearchBar, IconButton } from '@Elements';
import { WrapperModal } from '@Components';
import { Colors, Metric } from '../../../../Themes';
import { RequestApi } from '../../../../Services';
import ItemUnit from './Items/ItemUnit';
import { getValueByType, SuggestionTypes } from '../index';
import ItemSingle from './Items/ItemSingle';
import ListModel from '../../../../Context/Model/ListModel';
import AppList from '../../../Lists/AppList';
import { icons } from '../../../../Resources/icon';
import { generateGUID } from '../../../../Utils/number';
import ItemCompanyRepresentative from './Items/ItemCompanyRepresentative';

class SuggestionModal extends PureComponent {
  debounceSearch;
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      list: new ListModel(),
    };
  }

  componentDidMount = () => {
    const { keyword } = this.props;
    if (_.size(keyword) > 0) {
      this.setState({
        keyword,
      });
    }
    if (this.props.disableAutoLoad) {
      return;
    }
    this.getData(keyword || '');
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.addOnParams, prevProps.addOnParams)) {
      this.getData(this.state.keyword);
      return;
    }

    // load data when visible
    if (this.props.disableAutoLoad && this.props.visible && !prevProps.visible) {
      this.getData(this.state.keyword);
    }
  }
  getValueByType = (...params) => getValueByType(this.props.type, ...params);

  onItemPress = (item) => {
    const { onItemPress } = this.props;
    if (onItemPress) {
      onItemPress(item);
    }
  };

  changeTextSearch = (text) => {
    this.setState({ keyword: text });
    this.getData(text);
  };

  getData = async (keyword) => {
    const loadData = this.getValueByType(
      !this.props.isShowEmailAndPhone ? RequestApi.getMemberUnitByKeyword : RequestApi.requestGetListMemberByKeyword,
      RequestApi.getListLocation,
      RequestApi.getUserReportBy,
      RequestApi.filterWareHouse,
      RequestApi.filterCompanies,
      RequestApi.getBrands,
      RequestApi.getListEmployees,
      RequestApi.getListEmployees,
      RequestApi.getTransportServices,
      RequestApi.getDeliveryUser,
      RequestApi.filterMyForm,
      RequestApi.getPropertyList,
      RequestApi.getListSimpleUnits,
      RequestApi.filterCompanies,
      RequestApi.getListUnits,
      RequestApi.getListUnitsV2
    );

    this.setState({ list: new ListModel(), loading: true });
    try {
      const { list } = this.state;
      const { addOnParams = {}, keywordName = 'keyword' } = this.props;
      const result = await loadData(
        this.props.restParams || { [keywordName]: keyword, page: 1, pageSize: 50, ...addOnParams }
      );

      if(this.props.type === SuggestionTypes.LIST_UNIT_V2) {
        result.items.forEach((item) => {
          item.unitId = item.id
        })
      }

      list.setData({
        items: result.items || result,
        totalCount: 0,
      });

      this.setState({
        list,
        loading: false,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  renderItem = (item) => {
    const { fieldName, type } = this.props;    
    let Item = ItemSingle;
    if (_.includes([SuggestionTypes.REPORTED_BY, SuggestionTypes.UNIT], type)) {
      Item = ItemUnit;
    }
    if (type === SuggestionTypes.COMPANY_REPRESENTATIVE) {
      Item = ItemCompanyRepresentative;
    }

    return (
      <Item
        isShowEmailAndPhone={this.props.isShowEmailAndPhone}
        fieldName={fieldName}
        item={item}
        onPress={() => this.onItemPress(item)}
      />
    );
  };

  getKeyExtractor = (item) => {
    if (this.props.type === SuggestionTypes.LOCATION) {
      return generateGUID();
    }
    return `${item.id}`;
  };

  onPressAdd = () => {
    this.onItemPress({
      displayName: this.state.keyword,
    });
  };

  render() {
    const { keyword, list, loading } = this.state;
    const { visible, onClosePress } = this.props;
    const title = this.getValueByType(
      'AD_CRWO_TITLE_SELECT_MEMBER',
      'AD_CRWO_TITLE_SELECT_LOCATION',
      'SELECT_REPORT_BY',
      'INVENTORY_WAREHOUSES',
      'STOCK_COMPANY',
      'STOCK_BRAND',
      'STOCK_ISSUED_BY',
      'STOCK_TAKEN_BY',
      'DELIVERY_TRANSPORT_SERVICE',
      'DELIVERY_USERS',
      'FORM_NAME',
      'INSPECTION_PROPERTY',
      'AD_CRWO_TITLE_SELECT_MEMBER',
      'COMPANY',
      'UNIT',
      'UNIT'
    );
    const placeholder = this.getValueByType(
      'AD_CRWO_PLACEHOLDER_UNIT_MEMBER',
      'AD_CRWO_PLACEHOLDER_LOCATION',
      'SELECT_REPORT_BY_PLACEHOLDER',
      'INVENTORY_WAREHOUSES',
      'STOCK_COMPANY',
      'STOCK_BRAND',
      'STOCK_ISSUED_BY',
      'STOCK_TAKEN_BY',
      'DELIVERY_TRANSPORT_SERVICE',
      'DELIVERY_USERS',
      'FORM_NAME',
      'INSPECTION_PROPERTY',
      'AD_CRWO_PLACEHOLDER_UNIT_MEMBER',
      'COMMON_SEARCH',
      'COMMON_SEARCH',
      'COMMON_SEARCH'
    );

    const { data, isRefresh, isLoadMore, currentPage, totalPage } = list;

    const listProps = {
      data,
      isRefresh,
      isLoadMore,
      currentPage,
      totalPage,
      extraData: loading,
      iconName: icons.jobRequestEmpty,
      loadData: () => this.getData(keyword),
      keyExtractor: this.getKeyExtractor,
      renderItem: ({ item }) => this.renderItem(item),
    };

    const rightButton = this.props.showAddButton && (
      <IconButton onPress={this.onPressAdd} name="add-circle" color={Colors.azure} size={25} />
    );

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <WrapperModal title={I18n.t(title)} onRequestClose={onClosePress}>
            <View style={styles.container}>
              <SearchBar
                value={keyword}
                placeholder={placeholder}
                onSearch={this.changeTextSearch}
                style={styles.searchBar}
                rightButton={rightButton}
              />
              <AppList {...listProps} />
            </View>
          </WrapperModal>
        </View>
      </Modal>
    );
  }
}

export default SuggestionModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  line: {
    width: 1,
    backgroundColor: Colors.semiGray,
    height: Metric.Space,
    marginHorizontal: Metric.space10,
  },
  inputText: {
    height: Metric.space40,
    paddingVertical: 0,
    color: '#505E75',
    fontSize: 13,
    flex: 1,
  },
  inputView: {
    height: Metric.space40,
    backgroundColor: '#FFFFFF',
    borderRadius: Metric.borderRadius10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metric.Space,
    marginVertical: Metric.space10,
  },
});
