/**
 * Created by thienmd on 3/20/20
 */

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { Icon, Text } from '../../../Elements';
import FormControl, { commonFormStyles, useCommonFormController } from '../../Forms/FormControl';
import SuggestionModal from './SuggestionModal';
import { icons } from '../../../Resources/icon';

export const getValueByType = (
  type,
  unitVal,
  locationVal,
  reportedByVal,
  wareHouseVal,
  companyVal,
  brandVal,
  employeeVal,
  providerVal,
  transportVal,
  deliveryUserVal,
  formVal,
  propertyVal,
  simpleUnitVal,
  companyRepresentativeVal,
  listUnitVal,
  listUnitVal2
) => {
  switch (type) {
    case SuggestionTypes.LOCATION:
      return locationVal;
    case SuggestionTypes.REPORTED_BY:
      return reportedByVal;
    case SuggestionTypes.WARE_HOUSE:
      return wareHouseVal;
    case SuggestionTypes.COMPANY:
      return companyVal;
    case SuggestionTypes.BRAND:
      return brandVal;
    case SuggestionTypes.EMPLOYEE:
      return employeeVal;
    case SuggestionTypes.PROVIDER:
      return providerVal;
    case SuggestionTypes.TRANSPORT_SERVICE:
      return transportVal;
    case SuggestionTypes.DELIVERY_USERS:
      return deliveryUserVal;
    case SuggestionTypes.FORM:
      return formVal;
    case SuggestionTypes.PROPERTY:
      return propertyVal;
    case SuggestionTypes.SIMPLE_UNIT:
      return simpleUnitVal;
    case SuggestionTypes.COMPANY_REPRESENTATIVE:
      return companyRepresentativeVal;
    case SuggestionTypes.LIST_UNIT:
      return listUnitVal;
    case SuggestionTypes.LIST_UNIT_V2:
      return listUnitVal2;
    default:
      return unitVal;
  }
};

const FormSuggestionPicker = ({
  label,
  required,
  disabled,
  placeholder,
  onChange,
  mode,
  type,
  name,
  style,
  ...props
}) => {
  const fieldName = getValueByType(
    type,
    'fullUnitCode',
    'name',
    'displayName',
    'name',
    'companyName',
    'name',
    'displayName',
    'displayName',
    'name',
    'displayName',
    'formName',
    'name',
    'fullUnitCode',
    'companyRepresentative',
    'fullUnitCode',
    'fullUnitCode'
  );
  const { value, setFieldValue, error } = useCommonFormController(name);

  const keyword = value ? value[fieldName] : '';
  const [visible, setVisible] = useState(false);
  const selectedStyle = value ? styles.title : styles.placeholder;
  const selectedTitle = value ? value[fieldName] : 'COMMON_SELECT';
  const disableAutoLoad = type === SuggestionTypes.LOCATION;

  let containerStyle;
  let styleLabel;
  if (mode === 'small') {
    containerStyle = commonFormStyles.small.containerStyle;
    styleLabel = commonFormStyles.small.styleLabel;
  }
  const onClosePress = () => {
    setVisible(false);
  };

  const onDropdownPress = () => {
    setVisible(true);
  };

  const onItemPress = (item) => {
    setVisible(false);
    setFieldValue(item);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <FormControl label={label} error={error} required={required} styleLabel={styleLabel} style={style}>
      <TouchableOpacity
        style={[styles.wrapper, disabled ? styles.disabled : null, containerStyle]}
        onPress={onDropdownPress}
        disabled={disabled}
      >
        <Text numberOfLines={1} style={selectedStyle} text={selectedTitle} />
        {type === SuggestionTypes.LOCATION ? (
          <Icon source={icons.locationSelect} size={20} />
        ) : (
          <Ionicons name="caret-down" style={styles.dropdownIcon} size={20} color="#648FCA" />
        )}
      </TouchableOpacity>
      <SuggestionModal
        visible={visible}
        onClosePress={onClosePress}
        onItemPress={onItemPress}
        type={type}
        keyword={keyword}
        fieldName={fieldName}
        disableAutoLoad={disableAutoLoad}
        {...props}
      />
    </FormControl>
  );
};

export default FormSuggestionPicker;

export const SuggestionTypes = {
  UNIT: 'UNIT',
  LOCATION: 'LOCATION',
  REPORTED_BY: 'REPORTED_BY',
  WARE_HOUSE: 'WARE_HOUSE',
  COMPANY: 'COMPANY',
  BRAND: 'BRAND',
  EMPLOYEE: 'EMPLOYEE',
  PROVIDER: 'PROVIDER',
  TRANSPORT_SERVICE: 'TRANSPORT_SERVICE',
  DELIVERY_USERS: 'DELIVERY_USERS',
  FORM: 'FORM',
  PROPERTY: 'PROPERTY',
  SIMPLE_UNIT: 'SIMPLE_UNIT',
  COMPANY_REPRESENTATIVE: 'COMPANY_REPRESENTATIVE',
  LIST_UNIT: 'LIST_UNIT',
  LIST_UNIT_V2: 'LIST_UNIT_V2'
};
