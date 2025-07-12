/**
 * Created by thienmd on 10/7/20
 */
import React, { useState } from 'react';
import { Modal } from 'react-native';
import BaseLayout from '@Components/Layout/BaseLayout';
import { List } from '@Elements';
import I18n from '@I18n';
import _ from 'lodash';
import SelectObjectItem from '../SelectObjectItem';
import AddOrEditItemModal from '../AddOrEditItemModal';
import { cloneFormQuestion } from '../../../../../Transforms/InspectionTransformer';
import { icons } from '../../../../../Resources/icon';

const SelectItemModal = ({ visible, data, onClosePress, onComplete, moduleId, formUserAnswerGuid }) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const mainLayoutProps = {
    title: I18n.t('FORM_ADD_ITEM'),
    onLeftPress: onClosePress,
    rightBtn: {
      icon: icons.plus,
      onPress: () => {
        setIsAddNew(true);
      },
    },
  };

  const onClose = () => {
    setIsAddNew(false);
  };

  const onItemPress = (item, isCopy) => {
    setIsAddNew(false);
    onClosePress();
    onComplete(cloneFormQuestion(_.cloneDeep(item), isCopy));
  };

  // cons
  return (
    <Modal visible={visible}>
      <BaseLayout {...mainLayoutProps}>
        <List
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <SelectObjectItem
              name={item.description || item.questionType.name}
              {...item}
              onItemPress={() => onItemPress(item, true)}
            />
          )}
        />
        <AddOrEditItemModal
          moduleId={moduleId}
          visible={isAddNew}
          onClosePress={onClose}
          onComplete={onItemPress}
          formUserAnswerGuid={formUserAnswerGuid}
        />
      </BaseLayout>
    </Modal>
  );
};
export default SelectItemModal;
