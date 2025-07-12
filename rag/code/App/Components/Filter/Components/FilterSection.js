import React from 'react';
import I18n from '@I18n';
import { Text, Dropdown } from '@Elements';
import _ from 'lodash';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Colors, Metric } from '../../../Themes';
import FilterCheckBox from './FitlerCheckbox';
import ListSelect from './FilterListSelect';
import Input from '../../../Elements/Input';
import Row from '../../Grid/Row';
import { commonFormStyles } from '../../Forms/FormControl';

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  margin-top: 5px;
  background-color: ${Colors.border};
`;

const FilterInput = styled(Input).attrs({
  containerStyle: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: Colors.border,
  },
})``;

const FilterListSelect = styled(ListSelect).attrs({
  containerStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    width: Metric.ScreenWidth - 60,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 40,
  },
})``;

const ContentWrapper = styled.View`
  margin-vertical: 10px;
`;
// const HeaderSection = styled(I)
const FilterWrapper = ({ children, title, contentContainerStyle }) => (
  <View>
    <Row center>
      {_.size(title) > 0 && (
        <Text preset="medium" typo="H1">
          {I18n.t(title)}
        </Text>
      )}
    </Row>
    <Separator />
    <ContentWrapper style={contentContainerStyle}>{children}</ContentWrapper>
  </View>
);

const FilterCheckBoxSection = ({
  title,
  data,
  fieldName = 'name',
  valKey = 'id',
  selectFilter,
  numOfColumns = 2,
  isSort = false,
  isRadioBtn,
}) => {
  const onPressCheck = (item, index) => {
    selectFilter(index, item);
  };

  return (
    <FilterWrapper
      contentContainerStyle={{ flexDirection: isSort ? 'column' : 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}
      title={title}
    >
      {data.map((item, index) => (
        <FilterCheckBox
          onPress={() => onPressCheck(item, index)}
          key={`${item[valKey]}`}
          isRadioBtn={isRadioBtn}
          isAsc={item.isAsc}
          isSort={isSort}
          name={item[fieldName]}
          isCheck={item.isCheck}
          colorCode={item.colorCode}
          numOfColumns={isSort ? 1 : numOfColumns}
        />
      ))}
    </FilterWrapper>
  );
};

const FilterDropdownSection = ({ title, ...restProps }) => (
  <FilterWrapper title={title}>
    <Dropdown
      placeholder={I18n.t('COMMON_SELECT')}
      {...restProps}
      mode="small"
      containerStyle={commonFormStyles.small.containerStyle}
    />
  </FilterWrapper>
);

const FilterInputSection = ({ title, value, onValueChange }) => (
  <FilterWrapper title={title}>
    <FilterInput onChangeText={onValueChange} value={value} />
  </FilterWrapper>
);

const FilterListSelectSection = ({ title, listExist, selectFilter, getList, value = null, ...props }) => (
  <FilterWrapper title={title}>
    <FilterListSelect
      {...props}
      listExist={listExist}
      getList={getList}
      placeholder={I18n.t('COMMON_SELECT')}
      value={value}
      onChange={selectFilter}
    />
  </FilterWrapper>
);

export { FilterCheckBoxSection, FilterInputSection, FilterDropdownSection, FilterListSelectSection };
