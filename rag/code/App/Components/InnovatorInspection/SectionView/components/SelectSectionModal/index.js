/**
 * Created by thienmd on 10/7/20
 */
import React, { useState } from 'react';
import { Modal } from 'react-native';
import _ from 'lodash';
import BaseLayout from '@Components/Layout/BaseLayout';
import { List } from '@Elements';
import I18n from '@I18n';
import { useWatch } from 'react-hook-form';
import SelectObjectItem from '../SelectObjectItem';
import AddOrEditSectionModal from '../AddOrEditSectionModal';
import { cloneFormQuestion } from '../../../../../Transforms/InspectionTransformer';
import styles from './styles';
import useForm from '../../../../../Context/Form/Hooks/UseForm';
import { ImageResource } from '../../../../../Themes';
import SegmentControl from '../../../../segmentControl';
import { generateInspectionUUID, TableNames } from '../../../../../Services/OfflineDB/IDGenerator';

const SelectSectionModal = ({ visible, data, formGuid, onClosePress, onComplete, moduleId }) => {
  const formUserAnswerGuid = useWatch({ name: 'formUserAnswer.id' });
  const [isAddNew, setIsAddNew] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {
    form: { defineSections },
  } = useForm();

  const mainLayoutProps = {
    style: styles.container,
    title: I18n.t('INSPECTION_ADD_SECTION'),
    onLeftPress: onClosePress,
    rightBtn: {
      icon: ImageResource.IC_Plus,
      onPress: () => {
        setIsAddNew(true);
      },
    },
  };

  const onClose = () => {
    setIsAddNew(false);
  };

  const onItemPress = ({ id, guid, formQuestions, ...section }, isCopy) => {
    setIsAddNew(false);
    onClosePress();
    const formPageGuid = generateInspectionUUID(TableNames.formPage);
    onComplete({
      ...section,
      id: formPageGuid,
      formGuid,
      formQuestions: _.map(formQuestions, (question) => ({
        ...cloneFormQuestion(question, isCopy),
        formPageGuid,
        formUserAnswerGuid,
      })),
    });
  };

  // cons
  return (
    <Modal visible={visible}>
      <BaseLayout {...mainLayoutProps}>
        <SegmentControl
          values={[I18n.t('FORM_INTERNAL_SECTION'), I18n.t('FORM_PREDEFINED_SECTION')]}
          overflow
          selectedIndex={selectedTab}
          onChange={(selectedSegmentIndex) => {
            setSelectedTab(selectedSegmentIndex);
          }}
        />
        {selectedTab === 0 && (
          <List
            data={data}
            keyExtractor={(section, index) => `${index}`}
            renderItem={({ item }) => (
              <SelectObjectItem name={item.name} {...item} onItemPress={() => onItemPress(item, true)} />
            )}
          />
        )}
        {selectedTab === 1 && (
          <List
            data={defineSections}
            keyExtractor={(section, index) => `${index}`}
            renderItem={({ item }) => (
              <SelectObjectItem name={item.name} {...item} onItemPress={() => onItemPress(item, true)} />
            )}
          />
        )}

        <AddOrEditSectionModal visible={isAddNew} onClosePress={onClose} onComplete={onItemPress} />
      </BaseLayout>
    </Modal>
  );
};
export default SelectSectionModal;
