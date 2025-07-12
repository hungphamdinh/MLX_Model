/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Metric } from '../../Themes';

type Props = {
  visible: boolean,
  onRequestClose: Function,
  dismiss: Function,
  children: any,
  containerStyle: any,
};
export default class BaseModal extends Component<Props> {
  render() {
    const { visible, onRequestClose, dismiss, children, containerStyle } = this.props;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        // onDismiss={dismiss}
        onRequestClose={() => onRequestClose()}
      >
        <View style={styles.modalBackground}>{children}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // wallper: {
  //     flex: 1,
  //     alignItems: 'center',
  //     justifyContent: 'center'
  // },
  btnClose: {
    backgroundColor: '#fff',
    borderRadius: 8,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    width: Metric.ScreenWidth - 20,
  },
  content: {
    backgroundColor: '#fff',
  },
});
