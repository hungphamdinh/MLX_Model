/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@Elements';
import { withModal } from '@HOC';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import I18n from '@I18n';

const ActionButton = styled(Button).attrs(() => ({
  containerStyle: {
    marginBottom: 15,
  },
}))``;

const SectionOptionModal = ({ onEdit, onRemove, onReorder, onClosePress }) => {
  const onActionPress = (fnc) => () => {
    fnc();
    onClosePress();
  };

  return (
    <View style={styles.container}>
      <ActionButton title={I18n.t('AD_COMMON_EDIT')} rounded primary onPress={onActionPress(onEdit)} />
      <ActionButton title={I18n.t('AD_COMMON_REMOVE')} rounded danger onPress={onActionPress(onRemove)} />
      <ActionButton title={I18n.t('COMMON_REORDER')} rounded info onPress={onActionPress(onReorder)} />
    </View>
  );
};

export default withModal(SectionOptionModal, 'FORM_SELECT_ACTION');

SectionOptionModal.propTypes = {
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onReorder: PropTypes.func,
};

SectionOptionModal.defaultProps = {
  onEdit: () => {},
  onRemove: () => {},
  onReorder: () => {},
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
