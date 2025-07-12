import React, { Fragment } from 'react';
import { Modal, TouchableOpacity, View, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WrapperModal } from '@Components';
import { Text } from '@Elements';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from '@I18n';
import _ from 'lodash';
import styles from './styles';
import SearchBar from '../SearchBar';
import AppList from '../../Components/Lists/AppList';
import MemberItem from '../../Components/InnovatorInspection/MemberItem';
import ItemDropdown from '../../Components/ItemList/DropdownItem';
import Row from '../../Components/Grid/Row';
import DropdownWithChildItem from '../../Components/ItemList/DropdownWithChildItem';

const LazyDropdownItem = ({
  options,
  title,
  value,
  onChange,
  placeholder,
  haveChildItem = false,
  multiple,
  valKey,
  showValueByKey,
  disabled,
  lockValues,
  showSearchBar,
  isDropdownItem,
  titleKey,
  fieldName,
  getList,
  renderTitle,
  listExist,
  containerStyle,
  defaultTitle,
  small,
}) => {
  const { data, isRefresh, isLoadMore, currentPage, totalPage } = options;

  function updatePropsWhenHaveChildItem() {
    if (haveChildItem) {
      multiple = false;
      showValueByKey = false;
    }
    return { multiple, showValueByKey };
  }

  ({ multiple, showValueByKey } = updatePropsWhenHaveChildItem());

  const values = multiple ? value : value ? [value] : [];

  const childItemExists = values && values[0]?.localParentId && haveChildItem && !multiple;

  const getComparedValue = (comparedValue) => {
    if (comparedValue) {
      return showValueByKey ? comparedValue : comparedValue[valKey];
    }
    return null;
  };

  const [keyword, setKeyword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [listCheck, setListCheck] = React.useState([]);

  const listItem = _.size(listExist) > 0 && _.size(listCheck) === 0 ? listExist : listExist.concat(listCheck);

  const filterChildItem = (selectedItems) => {
    const listChild = listItem.filter((item) => item.childs.some((childItem) => childItem.id === values[0].id));
    if (_.size(listChild) === 0) {
      return _.first(selectedItems);
    }

    // have child items
    const filterItem = listChild.map((item) =>
      Object.assign({}, item, {
        child: item.childs.find((childItem) => childItem.id === values[0].id),
      })
    )[0];
    return filterItem ? filterItem.child : {};
  };

  let listData = [];
  if (childItemExists) {
    listData = [filterChildItem(values)];
  } else {
    listData = values;
  }

  const selectedObjs = listData.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

  const onClosePress = () => {
    setVisible(false);
  };

  const loadData = (page = 1, key = keyword) => {
    getList(page, key);
  };

  const onDropdownPress = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const onItemPress = (item) => {
    if (multiple) {
      const isExist = values.findIndex((val) => getComparedValue(val) === item[valKey]) > -1;
      if (isExist) {
        onChange(values.filter((val) => getComparedValue(val) !== item[valKey]));
        setListCheck(remove(listCheck, item.id));
        return;
      }

      onChange([...value, showValueByKey ? item[valKey] : item]);
      setListCheck([...listCheck, item]);
      return;
    }

    onChange(showValueByKey ? item[valKey] : item);
    setVisible(false);
  };

  const remove = (array, val) => array.filter((item) => item.id !== val);

  const onSearch = (text) => {
    setKeyword(text);
    loadData(1, text);
  };

  const selectedStyle = _.size(selectedObjs) || defaultTitle ? styles.title : styles.placeholder;
  const selectedTitle = _.size(selectedObjs)
    ? selectedObjs.map((item) => item[titleKey]).join(' ,')
    : defaultTitle || placeholder;

  const icon = _.get(_.first(selectedObjs), 'icon');
  const isSelected = (item) => values.findIndex((val) => getComparedValue(val) === item[valKey]) > -1;

  const listProps = {
    data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    contentContainerStyle: { paddingTop: 0 },
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item, idx) => `${idx}`,
    renderItem: ({ item }) => (
      <Fragment>
        {isDropdownItem ? (
          <Fragment>
            {haveChildItem ? (
              <DropdownWithChildItem
                isSelected={isSelected(item)}
                item={item}
                onItemPress={onItemPress}
                values={values}
                disabled={_.includes(lockValues, item[valKey])}
              />
            ) : (
              <ItemDropdown
                isSelected={isSelected(item)}
                item={item}
                onItemPress={onItemPress}
                values={values}
                fieldName={fieldName}
                disabled={_.includes(lockValues, item[valKey])}
              />
            )}
          </Fragment>
        ) : (
          <MemberItem
            isSelected={isSelected(item)}
            item={item}
            onItemPress={onItemPress}
            values={values}
            valKey={valKey}
            disabled={_.includes(lockValues, item[valKey])}
          />
        )}
      </Fragment>
    ),
  };

  return (
    <View>
      <TouchableOpacity
        style={[small ? styles.smallWrapper : styles.wrapper, disabled ? styles.disabled : null, containerStyle]}
        onPress={onDropdownPress}
        disabled={disabled}
      >
        <Row center style={styles.headerWrapper}>
          {<MaterialIcon name={icon} size={25} style={styles.icon} />}
          <Text style={selectedStyle} numberOfLines={1}>
            {renderTitle ? renderTitle(selectedObjs) : selectedTitle}
          </Text>
        </Row>
        <Ionicons name="caret-down" style={styles.dropdownIcon} size={20} color="#5F92CC" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <WrapperModal title={I18n.t(title)} onRequestClose={onClosePress}>
            <View style={styles.container}>
              {showSearchBar && <SearchBar value={keyword} placeholder={I18n.t('COMMON_SEARCH')} onSearch={onSearch} />}
              <AppList {...listProps} />
            </View>
          </WrapperModal>
        </View>
      </Modal>
    </View>
  );
};

export default LazyDropdownItem;

LazyDropdownItem.defaultProps = {
  title: '',
  value: [],
  placeholder: '',
  options: [],
  lockValues: [],
  multiple: false,
  showValueByKey: false,
  showSearchBar: false,
  onChange: () => {},
  fieldName: 'name',
  titleKey: 'name',
  valKey: 'id',
  listExist: [],
  haveChildItem: false,
  isDropdownItem: true,
  defaultTitle: '',
};
