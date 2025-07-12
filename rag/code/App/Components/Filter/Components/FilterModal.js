import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Modal, SafeAreaView } from 'react-native';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Button, Text } from '../../../Elements';
import {
  FilterCheckBoxSection,
  FilterInputSection,
  FilterDropdownSection,
  FilterListSelectSection,
} from './FilterSection';

import AppNavigationBar from '../../Layout/AppNavigationBar';
import { icons } from '../../../Resources/icon';
import FilterDateSection from './FilterDateSection';
import AwareScrollView from '../../Layout/AwareScrollView';
import { Colors } from '../../../Themes';
import { FilterTypes } from '../index';

const ModalWrapper = styled.View`
  background-color: rgba(0, 19, 53, 0.68);
  flex: 1;
`;

const Container = styled.View`
  max-height: 92%;
`;

const ButtonWrapper = styled.View`
  background-color: ${Colors.bgMain};
  height: 80px;
  padding-top: 20px;
`;

const FilterScrollView = styled(AwareScrollView).attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 40,
  },
}))`
  padding-horizontal: 15px;
  padding-top: 12px;
  background-color: ${Colors.bgMain};
`;

const Box = styled.View`
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 10px;
`;

const DateWrapper = styled.View`
  margin-bottom: 10px;
`;

const FilterModal = ({ visible, onHideModal, data, selectedFilter, defaultFilter, onCompleted, onClear }) => {
  const [selectedValue, setSelectedValue] = useState({});
  useEffect(() => {
    setSelectedValue(_.cloneDeep(selectedFilter));
  }, [visible]);

  const onClearFilter = () => {
    setSelectedValue(_.cloneDeep(defaultFilter) || {});
    if (onClear) {
      onClear();
    }
  };

  const onApplyPress = () => {
    onHideModal();
    onCompleted(selectedValue);
  };

  const filterKeys = _.keys(data);

  const haveDateFilter = filterKeys.findIndex((key) => key === 'dateRange') > -1;

  const allKeys = filterKeys.filter((key) => key !== 'dateRange');
  return (
    <Modal visible={visible} transparent>
      <ModalWrapper>
        <AppNavigationBar
          leftIcon={icons.back}
          title={I18n.t('COMMON_FILTERS')}
          showBell={false}
          onLeftPress={onHideModal}
          onDrawerChange={() => {}}
          customRightBtn={
            <Button onPress={onClearFilter}>
              <Text preset="bold" style={{ textDecorationLine: 'underline' }} text="COMMON_CLEAR_FILTER" />
            </Button>
          }
        />
        <SafeAreaView>
          <Container>
            <FilterScrollView>
              {haveDateFilter && (
                <Box>
                  <FilterDateSection
                    title={data.dateRange.title || 'COMMON_CREATED_DATE'}
                    dateRange={selectedValue.dateRange}
                    onChange={(dateRange) => {
                      selectedValue.dateRange = dateRange;
                      setSelectedValue({ ...selectedValue });
                    }}
                  />
                </Box>
              )}
              <Box>
                {allKeys.map((key) => {
                  const filter = data[key];
                  const valKey = filter.valKey || 'id';
                  const currentFilter = _.get(selectedValue, key, []);
                  const type = filter.type;
                  if (type === FilterTypes.DATE_TIME) {
                    return (
                      <DateWrapper>
                        <FilterDateSection
                          key={key}
                          title={filter.title}
                          dateRange={selectedValue[key]}
                          onChange={(dateRange) => {
                            selectedValue[key] = dateRange;
                            setSelectedValue({ ...selectedValue });
                          }}
                        />
                      </DateWrapper>
                    );
                  }
                  if (type === FilterTypes.DROPDOWN) {
                    return (
                      <FilterDropdownSection
                        onChange={(values) => {
                          selectedValue[key] = values;
                          _.forEach(filter.resetPropsOnChange, (prop) => {
                            selectedValue[prop] = undefined;
                          });
                          setSelectedValue({ ...selectedValue });
                          if (filter.onChange) {
                            filter.onChange(values);
                          }
                        }}
                        {...filter.dropdownProps}
                        options={filter.options}
                        value={selectedValue[key]}
                        title={filter.title}
                        valKey={filter.valKey}
                        fieldName={filter.fieldName}
                        key={`${key.id}`}
                      />
                    );
                  }
                  if (!filter.options) {
                    return (
                      <FilterInputSection
                        key={key}
                        title={filter.title}
                        value={selectedValue[key]}
                        onValueChange={(text) => {
                          selectedValue[key] = text;
                          setSelectedValue({ ...selectedValue });
                        }}
                      />
                    );
                  }

                  if (type === FilterTypes.LIST_SELECT) {
                    return (
                      <FilterListSelectSection
                        key={key}
                        listExist={filter.listExist}
                        getList={filter.getList}
                        {...filter}
                        value={selectedValue[key]}
                        title={filter.title}
                        showValueByKey={false}
                        selectFilter={(value) => {
                          selectedValue[key] = value;
                          _.forEach(filter.resetPropsOnChange, (prop) => {
                            selectedValue[prop] = undefined;
                          });
                          setSelectedValue({ ...selectedValue });
                          if (filter.onChange) {
                            filter.onChange(value);
                          }
                        }}
                      />
                    );
                  }
                  const filterOptions = filter.options.map((option) => ({
                    ...option,
                    id: option[valKey],
                    isCheck: currentFilter.findIndex((id) => id === option[valKey]) > -1,
                  }));

                  return (
                    <FilterCheckBoxSection
                      key={key}
                      title={filter.title}
                      valKey={filter.valKey}
                      fieldName={filter.fieldName}
                      numOfColumns={filter.numOfColumns}
                      data={filterOptions}
                      isRadioBtn={!filter.multiple}
                      changeSortType={(isAsc) => {
                        if (selectedValue[key].length > 0) {
                          selectedValue[key] = [
                            { data: selectedValue[key][0] ? selectedValue[key][0].data : undefined, isAsc },
                          ];
                          setSelectedValue({ ...selectedValue });
                        }
                      }}
                      selectFilter={(cbIndex, item) => {
                        const { multiple } = filter;
                        const isExist = _.findIndex(currentFilter, (id) => id === item[valKey]) > -1;

                        if (!multiple) {
                          selectedValue[key] = [item[valKey]];
                        } else if (!isExist) {
                          selectedValue[key] = [...currentFilter, item[valKey]];
                        } else {
                          selectedValue[key] = currentFilter.filter((id) => id !== item[valKey]);
                        }
                        if (filter.onTrigger) {
                          filter.onTrigger(item, isExist, selectedValue);
                        }

                        setSelectedValue({ ...selectedValue });
                      }}
                    />
                  );
                })}
              </Box>
            </FilterScrollView>
            <ButtonWrapper>
              <Button primary rounded title="COMMON_APPLY" onPress={onApplyPress} />
            </ButtonWrapper>
          </Container>
        </SafeAreaView>
      </ModalWrapper>
    </Modal>
  );
};

export default FilterModal;
