/**
 * Created by thienmd on 10/7/20
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@Elements';
import _ from 'lodash';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metric } from '@Themes';
import PropTypes from 'prop-types';
import Row from '../Grid/Row';

import { ImageResource, Colors } from '../../Themes';
import { Icon } from '../../Elements';
import LocaleConfig from '../../Config/LocaleConfig';

const InfoItem = ({ marginBottom, icon, text, bold, textStyle, color, unSyncItem }) => {
  if (_.size(text) === 0) {
    return null;
  }
  return (
    <Row style={[styles.container, { marginBottom: marginBottom ? Metric.space10 : 0 }]}>
      {icon && <Ionicons name={icon} size={25} color="black" />}
      <Row center style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          bold={bold}
          style={[styles.text, { fontWeight: bold ? 'bold' : 'normal' }, { color }, textStyle]}
        >
          {text}
        </Text>
        {unSyncItem && unSyncItem.count && (
          <Text style={styles.textCount}>{`${unSyncItem.title}: ${unSyncItem.count}`}</Text>
        )}
      </Row>
    </Row>
  );
};

export default React.memo(InfoItem);

export const DateInfoItem = ({ marginBottom, date, bold, textStyle, color }) => {
  if (_.size(date) === 0) {
    return null;
  }
  const startDate = moment(date).format(LocaleConfig.dateTimeFormat);
  return (
    <Row style={[styles.container, { marginBottom: marginBottom ? Metric.space10 : 0 }]}>
      <Icon source={ImageResource.IC_Calendar} size={Metric.iconSize15} style={{ marginLeft: 8 }} />
      <Text style={[styles.text, { fontWeight: bold ? 'bold' : 'normal' }, { color }, textStyle]}>{startDate}</Text>
    </Row>
  );
};

InfoItem.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  bold: PropTypes.bool,
  marginBottom: PropTypes.bool,
};

InfoItem.defaultProps = {
  icon: undefined,
  text: '',
  color: 'black',
  bold: false,
  marginBottom: true,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Metric.space10,
    flex: 1,
  },
  text: {
    marginLeft: 8,
    color: '#8E8E93',
    fontWeight: '400',
    alignSelf: 'center',
    flex: 1,
  },
  textCount: {
    color: Colors.gray,
  },
});
