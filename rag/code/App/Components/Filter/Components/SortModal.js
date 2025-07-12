import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Modal, SafeAreaView } from 'react-native';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Button, Text } from '../../../Elements';
import { FilterCheckBoxSection } from './FilterSection';

import AppNavigationBar from '../../Layout/AppNavigationBar';
import { icons } from '../../../Resources/icon';
import AwareScrollView from '../../Layout/AwareScrollView';
import { Colors } from '../../../Themes';

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

const SortModal = ({ visible, onHideModal, data, selectedFilter, onCompleted }) => {
  const [selectedValue, setSelectedValue] = useState({});
  useEffect(() => {
    setSelectedValue(_.cloneDeep(selectedFilter));
  }, [visible]);

  const onClearFilter = () => {
    setSelectedValue({});
  };

  const onApplyPress = () => {
    onHideModal();
    onCompleted(selectedValue);
  };

  const filterKeys = _.keys(data);

  const allKeys = filterKeys.filter((key) => key !== 'dateRange');
  return (
    <Modal visible={visible} transparent>
      <ModalWrapper>
        <AppNavigationBar
          leftIcon={icons.back}
          title={I18n.t('COMMON_SORT')}
          showBell={false}
          onLeftPress={onHideModal}
          onDrawerChange={() => {}}
          customRightBtn={
            <Button onPress={onClearFilter}>
              <Text preset="bold" style={{ textDecorationLine: 'underline' }} text="COMMON_CLEAR_SORT" />
            </Button>
          }
        />
        <SafeAreaView>
          <Container>
            <FilterScrollView>
              <Box>
                {allKeys.map((key) => {
                  const filter = data[key];
                  const valKey = filter.valKey || 'id';
                  const currentFilter = _.get(selectedValue, key, []);

                  const filterOptions = filter.options.map((option) => ({
                    ...option,
                    id: option[valKey],
                    isCheck: currentFilter.findIndex((item) => item[valKey] === option[valKey]) > -1,
                  }));

                  return (
                    <FilterCheckBoxSection
                      key={key}
                      title={filter.title}
                      valKey={filter.valKey}
                      isSort
                      fieldName={filter.fieldName}
                      numOfColumns={filter.numOfColumns}
                      data={filterOptions}
                      isRadioBtn={!filter.multiple}
                      selectFilter={(cbIndex, item) => {
                        const { multiple } = filter;
                        const isExist = _.findIndex(currentFilter, (id) => id === item[valKey]) > -1;

                        if (!multiple) {
                          selectedValue[key] = [item];
                        } else if (!isExist) {
                          selectedValue[key] = [...currentFilter, item[valKey]];
                        } else {
                          selectedValue[key] = currentFilter.filter((id) => id !== item[valKey]);
                        }
                        setSelectedValue({ ...selectedValue });
                        // filter.value
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

export default SortModal;
