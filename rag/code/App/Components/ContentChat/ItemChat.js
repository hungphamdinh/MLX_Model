/* @flow */

import get from 'lodash/get';
import React, { Component } from 'react';
import {
  View, Dimensions, StyleSheet,
} from 'react-native';
import moment from 'moment';
import { Text } from '../../Elements';
import {
  ImageResource, Colors, Metric,
} from '../../Themes';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
import APIConfig from '../../Config/apiConfig';

type Props = {
  item: Object,
  app: Object,
  auth: Object,
};

const AVT_SIZE = 36;

export default class ItemChat extends Component<Props> {
  render() {
    const {
      content, creationTime, creatorUserId, profilePictureId
    } = this.props.item;
    const { user } = this.props;
    const idUser = get(user, 'id');
    const userName = get(this.props.item, 'userName') || '';
    const times = moment(creationTime).format('HH:mm:ss - DD-MM-YYYY');
    const image = profilePictureId ? `${APIConfig.apiCore}/api/File/GetDownloadFileByGuid?fileGuid=${profilePictureId}` : ImageResource.IMG_AvatarDefault;
    if (creatorUserId === idUser) {
      return (
          <View style={styles.containAdmin}>

              <View style={[styles.viewChat, { backgroundColor: Colors.bgWhite, marginRight: 10 }]}>
                  <Text preset="medium" style={styles.textUserName}>{userName}</Text>
                  <Text style={styles.textContent}>{content}</Text>
                  <Text style={styles.textTime}>{times}</Text>
              </View>
              <FastImage style={{ width: AVT_SIZE, height: AVT_SIZE, borderRadius: AVT_SIZE / 2 }} source={typeof image === 'number' ? image : { uri: image }} />
          </View>
      );
    }
    return (
        <View style={styles.containAdmin}>
            <FastImage style={{ width: AVT_SIZE, height: AVT_SIZE, borderRadius: AVT_SIZE / 2 }} source={typeof image === 'number' ? image : { uri: image }} />
            <View style={[styles.viewChat, { backgroundColor: '#4A89E8' }]}>
                <Text style={{ color: '#FFF', }} preset={'medium'}>{userName}</Text>
                <Text style={[styles.textContent, { color: '#FFF' }]}>{content}</Text>
                <Text style={[styles.textTime, { color: 'rgba(255,255,255,0.5)' }]}>{times}</Text>
            </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  contain: {
    marginRight: Metric.Space,
    marginLeft: Metric.space60,
    marginVertical: Metric.space10,
    flexDirection: 'row',
  },
  containAdmin: {
    width: width - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    marginVertical: 20,
  },
  viewChat: {
    flex: 1,
    backgroundColor: Colors.bgHeather,
    borderRadius: 20,
    paddingVertical: Metric.space5,
    marginLeft: Metric.space20,
    paddingLeft: Metric.Space,
  },
  textContent: {
    marginTop: 5,
    color: '#515E6D',
    fontSize: 13,
    fontWeight: '600'
  },
  textUserName: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold'
  },
  textTime: {
    marginTop: 5,
    color: 'rgba(69,79,102,0.5)',
    fontSize: 12
  }
});
