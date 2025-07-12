import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';

import { ImageView, Text } from '../../../Elements';
import { CheckBox } from '../../Forms/FormCheckBox';
import { Colors } from '../../../Themes';
import I18n from '../../../I18n';
import LocaleConfig from '../../../Config/LocaleConfig';

const Section = ({ title, content }) => (
  <Text style={{ marginRight: 105 }}>
    <Text text={`${I18n.t(title)}:  `} preset="medium" />
    <Text color={Colors.gray}>{content}</Text>
  </Text>
);
const ItemWrapper = ({ item, onCheckBoxPress }) =>
  useMemo(() => {
    const pressCheckBox = () => {
      onCheckBoxPress(item);
    };

    return (
      <View style={styles.container}>
        <CheckBox key={item.id} value={item.checked} onCheckBoxPress={pressCheckBox} />
        <View style={styles.imageWrapper}>
          <ImageView style={styles.image} source={item.fileUrls.length > 0 && { fileUrl: item.fileUrls[0].fileUrl }} />
        </View>
        <View style={styles.wrapper}>
          <Section title="DELIVERY_RECEIVER" content={item.residentUser?.displayName} />
          <Section title="DELIVERY_PARCEL_NUMBER" content={item.id} />
          <Section title="DELIVERY_PARCEL_TYPE" content={item.deliveryType.name} />
          <Section
            title="DELIVERY_LOGIN_DATE"
            content={moment(item.creationTime).format(`${LocaleConfig.dateTimeFormat}`)}
          />
        </View>
      </View>
    );
  }, [item]);

export default ItemWrapper;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flexDirection: 'row',
  },
  sectionContent: {
    marginLeft: 10,
  },
  wrapper: {
    marginBottom: 20,
  },
  image: {
    marginBottom: 20,
    borderColor: Colors.gray,
    borderRadius: 10,
    width: 70,
    height: 70,
  },
  imageWrapper: {
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 10,
  },
});
