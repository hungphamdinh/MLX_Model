/**
 * Created by thienmd on 9/30/20
 */
/* @flow */
import React, { useMemo } from 'react';
import { FlatList, Keyboard, Modal, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { WrapperModal } from '@Components';
import { ImageResource, Metric } from '@Themes';
import { Icon, Text } from '@Elements';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from '@I18n';
import _ from 'lodash';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import Row from '../../Components/Grid/Row';
import SearchBar from '../SearchBar';
import { CheckBox } from '../../Components/Forms/FormCheckBox';
import { Wrapper } from '../../Components/ItemApp/ItemCommon';
import Tag from '../Tag';
import { Colors } from '../../Themes';

const ColorBox = styled.View`
  background-color: ${(props) => props.color};
  width: 15px;
  height: 15px;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
  margin-right: 5px;
`;

const ImageIcon = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 8px;
`;

export const getItemIcon = (icon) => {
  let iconComp;
  if (icon) {
    if (_.startsWith(icon, 'https')) {
      iconComp = <ImageIcon source={{ uri: icon }} resizeMode="contain" />;
    } else {
      iconComp = <MaterialIcon name={icon} size={25} style={styles.icon} />;
    }
  }
  return iconComp;
};

export const DropdownItem = ({ style, item, onItemPress, isSelected, disabled, fieldName }) => (
  <Wrapper
    style={{ backgroundColor: disabled ? Colors.disabled : Colors.bgWhite }}
    onPress={disabled ? null : () => onItemPress(item)}
    disabled={disabled}
  >
    <Row style={[styles.itemTitle, style]} center>
      {getItemIcon(item.icon)}
      <Row style={styles.itemTitle}>
        <Text>{item[fieldName] || item.label}</Text>
        {item.tagName && <Tag style={{ marginLeft: 5 }} text={item.tagName} />}
      </Row>
      {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
    </Row>
  </Wrapper>
);

const Dropdown = (props) => {
  const {
    options,
    title,
    value,
    onChange,
    placeholder,
    multiple,
    valKey,
    showValue,
    disabled,
    lockValues,
    showSearchBar,
    containerStyle,
    fieldName,
    showCheckAll = true,
    renderCustomButtonView,
    defaultTitle,
    titleStyle,
    onDropdownVisible,
    isArrayResults,
    shouldUniqueItems,
    initData,
  } = props;
  const values = multiple || isArrayResults ? value : Array.isArray(value) ? [] : [value];

  const getComparedValue = (comparedValue) => {
    if (comparedValue) {
      return showValue ? comparedValue : comparedValue[valKey];
    }
    return null;
  };
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [searchData, setSearchData] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const listData = _.size(keyword) > 0 ? searchData : options;

  React.useEffect(() => {
    setIsCheckAll(_.size(options) === _.size(values) && _.size(values) > 0);
  }, [ _.size(values)]);
  

  const selectedObjs = useMemo(() => {
    if (_.size(values) === 0) {
      return [];
    }

    // Find matching items based on `values`
    const matchedItems = _.filter(options, (item) => values.some((val) => getComparedValue(val) === item[valKey]));

    // Return initial data if no matches are found
    if (matchedItems.length === 0 && initData) {
      return multiple ? (Array.isArray(initData) ? initData : [initData]) : [initData];
    }

    return matchedItems;
  }, [values, options, initData, multiple, valKey, getComparedValue]);

  const onClosePress = () => {
    setVisible(false);
  };

  const onCheckAllPress = () => {
    if (!isCheckAll) {
      const checkedOptions = listData.map((item) => (showValue ? item[valKey] : item));
      onChange(checkedOptions);
    } else {
      onChange([]);
    }

    setIsCheckAll(!isCheckAll);
  };

  const onDropdownPress = () => {
    Keyboard.dismiss();
    setVisible(true);
    if (onDropdownVisible) {
      onDropdownVisible();
    }
  };

  const onItemPress = (item) => {
    if (multiple) {
      const isExist = values.findIndex((val) => getComparedValue(val) === item[valKey]) > -1;
      if (isExist) {
        onChange(
          values.filter((val) => getComparedValue(val) !== item[valKey]),
          item
        );
        return;
      }

      onChange([...value, showValue ? item[valKey] : item]);
      // setVisible(false);
      return;
    }

    const result = showValue ? item[valKey] : item;

    onChange(isArrayResults ? [result] : result);
    setVisible(false);
  };

  const onSearch = (text) => {
    setKeyword(text);
    const newSearchData = options.filter((item) => {
      const lowerName = (item[fieldName] || item.label || '').toLowerCase();
      if (lowerName.indexOf(text.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
    if (props.onSearch) {
      props.onSearch(text);
    }
    setSearchData(newSearchData);
  };

  const selectedStyle = _.size(selectedObjs) || defaultTitle ? styles.title : styles.placeholder;
  let selectedTitle =  defaultTitle || placeholder;

  if(_.size(selectedObjs)) {
    const processedObjs = shouldUniqueItems
    ? _.uniqBy(selectedObjs, 'id') // Remove duplicates based on 'id'
    : selectedObjs;

    selectedTitle = processedObjs.map((item) => item[fieldName] || item.label).join(', ');
  }

  const icon = _.get(_.first(selectedObjs), 'icon');
  const colorCode = _.get(_.first(selectedObjs), 'colorCode');
  const isSelected = (item) => values.findIndex((val) => getComparedValue(val) === item[valKey]) > -1;

  const dropdownButtonView = (
    <View style={[styles.wrapper, disabled ? styles.disabled : null, containerStyle]}>
      {getItemIcon(icon)}
      {colorCode && <ColorBox color={colorCode} />}

      <Text style={[selectedStyle, titleStyle]} numberOfLines={1}>
        {selectedTitle}
      </Text>
      <Ionicons name="caret-down" style={styles.dropdownIcon} size={20} color="#648FCA" />
    </View>
  );

  return (
    <View>
      <TouchableOpacity onPress={onDropdownPress} disabled={disabled}>
        {renderCustomButtonView ? renderCustomButtonView(selectedTitle, isSelected) : dropdownButtonView}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <WrapperModal title={I18n.t(title)} onRequestClose={onClosePress}>
            <View style={styles.container}>
              <View style={{ height: Metric.Space }} />
              {showSearchBar && (
                <Row>
                  {showCheckAll && multiple && (
                    <CheckBox value={isCheckAll} containerStyle={styles.checkAll} onCheckBoxPress={onCheckAllPress} />
                  )}
                  <SearchBar
                    value={keyword}
                    style={{ flex: 1 }}
                    placeholder={I18n.t('COMMON_SEARCH')}
                    onSearch={onSearch}
                  />
                </Row>
              )}

              <FlatList
                data={_.size(keyword) > 0 ? searchData : options}
                renderItem={({ item }) => (
                  <DropdownItem
                    isSelected={isSelected(item)}
                    item={item}
                    onItemPress={onItemPress}
                    values={values}
                    valKey={valKey}
                    fieldName={fieldName}
                    disabled={_.includes(lockValues, item[valKey])}
                  />
                )}
                keyExtractor={(item) => `${item[valKey]}`}
                refreshing={false}
                removeClippedSubviews={false} // Unmount components when outside of window
                windowSize={7}
                extraData={values}
                style={styles.flatList}
              />
              <View style={{ height: Metric.space10 }} />
            </View>
          </WrapperModal>
        </View>
      </Modal>
    </View>
  );
};

export default Dropdown;

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

Dropdown.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(valueType), valueType, PropTypes.object]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: valueType,
    })
  ),
  lockValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  valKey: PropTypes.string,
  fieldName: PropTypes.string,
  multiple: PropTypes.bool,
  // this field to determine what will return when select dropbox, just only value or return item object
  showValue: PropTypes.bool,
  showSearchBar: PropTypes.bool,
};

Dropdown.defaultProps = {
  title: '',
  value: [],
  placeholder: '',
  options: [],
  lockValues: [],
  multiple: false,
  showValue: true,
  showSearchBar: false,
  onChange: () => {},
  valKey: 'id',
  fieldName: 'name',
};
