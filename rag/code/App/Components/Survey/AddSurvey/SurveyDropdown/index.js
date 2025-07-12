/**
 * Created by thienmd on 9/30/20
 */
/* @flow */
import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, TouchableOpacity, View } from 'react-native';
import { WrapperModal } from '@Components';
import { Fonts, ImageResource, Metric } from '@Themes';
import { Icon, Text, SearchBar } from '@Elements';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '@I18n';
import _ from 'lodash';
import styles from './styles';
import AppList from '../../../Lists/AppList';
import { PAGE_SIZE } from '../../../../Config';
import useSurvey from '../../../../Context/Survey/Hooks/UseSurvey';
import FormControl, { useCommonFormController } from '../../../Forms/FormControl';
import Row from '../../../Grid/Row';
import { Wrapper } from '../../../ItemApp/ItemCommon';

const SurveyDropdownItem = ({ item, onItemPress, isSelected, disabled }) => (
  <Wrapper onPress={() => onItemPress(item)} disabled={disabled}>
    <Row center>
      {<MaterialIcon name={item.icon} size={25} style={styles.icon} />}
      <Text fontFamily={Fonts.SemiBold} style={styles.itemTitle}>
        {item.name || item.label}
      </Text>
      {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
    </Row>
  </Wrapper>
);

const SurveyDropdown = (props) => {
  const { title, value, onChange, placeholder, valKey, showValue } = props;
  const {
    survey: { existingSurveys },
    filterExistingSurvey,
  } = useSurvey();

  const [visible, setVisible] = React.useState(false);
  const onClosePress = () => {
    setVisible(false);
  };

  const onDropdownPress = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const onItemPress = (item) => {
    onChange(showValue ? item[valKey] : item);
    setVisible(false);
  };

  const selectedStyle = value ? styles.title : styles.placeholder;
  const selectedTitle = value ? value.name : placeholder;

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadData(1);
  }, [keyword]);

  const onSearch = (text) => {
    setKeyword(text);
  };

  const loadData = (page) => {
    filterExistingSurvey({
      sorting: 'id',
      keyword,
      page,
      pageSize: PAGE_SIZE,
    });
  };

  const listProps = {
    data: existingSurveys.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: existingSurveys.isRefresh,
    isLoadMore: existingSurveys.isLoadMore,
    currentPage: existingSurveys.currentPage,
    totalPage: existingSurveys.totalPage,
    loadData: ({ page }) => loadData(page),
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => (
      <SurveyDropdownItem
        isSelected={_.get(value, 'id') === item.id}
        item={item}
        onItemPress={() => onItemPress(item)}
      />
    ),
  };

  // const listProps = {
  // <SurveyDropdownItem
  //
  //   item={item}
  //   onItemPress={onItemPress}
  //   values={values}
  //   valKey={valKey}
  //   disabled={_.includes(lockValues, item[valKey])}
  // />)}

  return (
    <View>
      <TouchableOpacity style={[styles.wrapper]} onPress={onDropdownPress}>
        <Text style={selectedStyle} numberOfLines={1}>
          {selectedTitle}
        </Text>
        <Ionicons name="caret-down" style={styles.dropdownIcon} size={20} color="#648FCA" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <WrapperModal title={I18n.t(title)} onRequestClose={onClosePress}>
            <View style={styles.container}>
              <SearchBar placeholder={I18n.t('COMMON_SEARCH')} onSearch={onSearch} />

              <AppList {...listProps} />
              <View style={{ height: Metric.space10 }} />
            </View>
          </WrapperModal>
        </View>
      </Modal>
    </View>
  );
};

const FormSurveyDropdown = ({
  name,
  label,
  placeholder = '',
  options = [],
  required,
  onChange,
  translate,
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  return (
    <FormControl translate={translate} label={label} error={error} required={required}>
      <SurveyDropdown
        {...props}
        title={label}
        placeholder={placeholder}
        onChange={(values) => {
          setFieldValue(values);
          if (onChange) {
            onChange(values);
          }
        }}
        options={options}
        value={value}
      />
    </FormControl>
  );
};

export default FormSurveyDropdown;
