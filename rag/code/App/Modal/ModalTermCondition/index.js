import React from 'react';
import { Image, Platform, StyleSheet, View, Modal, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import WebView from 'react-native-webview';
import { Button } from '../../Elements';
import { ImageResource } from '../../Themes';

function ModalTermCondition({ termConditionContent, modalVisible, onClose, onPressAcceptTermCondition }) {
  const [disabledAgree, setDisabledAgree] = React.useState(true);

  React.useEffect(() => {
    if (!modalVisible) {
      setDisabledAgree(true);
    }
  }, [modalVisible]);

  const injectedJavaScript = `window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
       window.ReactNativeWebView.postMessage("scrollEnd!")
    }};`;

  return (
    <Modal visible={modalVisible}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={onClose}>
            <Image source={ImageResource.IC_Close} />
          </TouchableOpacity>
        </View>
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: termConditionContent }}
          scalesPageToFit={Platform.OS === 'android'}
          automaticallyAdjustContentInsets={false}
          injectedJavaScript={injectedJavaScript}
          onMessage={() => {
            if (disabledAgree) {
              setDisabledAgree(false);
            }
          }}
        />

        <Button
          disabled={disabledAgree}
          title="SE_BTN_ACCEPT_CONFIRM"
          primary
          rounded
          onPress={onPressAcceptTermCondition}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    margin: 0,
    marginVertical: 40,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    position: 'relative',
  },
  closeButton: {
    marginLeft: 20,
    width: 20,
    height: 20,
  },
  wrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
    marginBottom: 10,
    marginTop: 35,
  },
});

ModalTermCondition.propTypes = {
  modalVisible: PropTypes.bool,
};

ModalTermCondition.defaultProps = {
  modalVisible: false,
};

export default ModalTermCondition;
