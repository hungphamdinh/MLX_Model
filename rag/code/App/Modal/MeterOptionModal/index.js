/* eslint-disable no-unused-expressions */
/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity, Text, SafeAreaView} from 'react-native';
import { Colors, Metric, Fonts, ImageResource } from '../../Themes';
import { Icon } from '../../Elements';
import I18n from '../../I18n';

const data = [
  {
    id: 0,
    text: 'METER_READING_CREATE_MANUAL',
    image: ImageResource.IC_Plus,
  },
  {
    id: 1,
    text: 'METER_READING_CREATE_QR_CODE',
    image: ImageResource.IC_QR_CODE,
  },
];
const MeterOptionModal = ({isVisible, setVisible, navigation}) => {
  const onPressItem = (item) => {
    item.id === 0 ? navigation.navigate('createMeterManual') : navigation.navigate('createMeterByQr');
    setVisible(false);
  };
  return (
      <Modal transparent onRequestClose={() => setVisible(false)} visible={isVisible} animationType="slide">
          <View style={styles.container}>
              <SafeAreaView style={styles.content}>
                  <TouchableOpacity style={styles.header} onPress={setVisible}>
                      <Icon source={ImageResource.IC_Close} size={20} />
                  </TouchableOpacity>
                  <View style={styles.body}>
                      {data.map(item => (
                          <TouchableOpacity style={styles.item} onPress={() => onPressItem(item)} key={item.id.toString()}>
                              <Icon size={13} source={item.image} />
                              <Text style={styles.text}>{I18n.t(item.text)}</Text>
                          </TouchableOpacity>
          ))}
                  </View>

              </SafeAreaView>

          </View>
      </Modal>
  );
};


export default MeterOptionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: Colors.bgMain,
    borderTopLeftRadius: Metric.borderRadius10,
    borderTopRightRadius: Metric.borderRadius10,
  },
  item: {
    padding: Metric.space15,
    marginTop: Metric.space10,
    marginHorizontal: Metric.space20,
    backgroundColor: Colors.bgWhite,
    borderRadius: Metric.borderRadius10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: Fonts.SemiBold,
    marginLeft: Metric.space15,
  },
  body: {
    backgroundColor: Colors.bgMain,
    paddingBottom: 20,
    paddingTop: 15,
  },
  header: {
    padding: Metric.space15,
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: Metric.borderRadius10,
    borderTopRightRadius: Metric.borderRadius10,
  },
});
