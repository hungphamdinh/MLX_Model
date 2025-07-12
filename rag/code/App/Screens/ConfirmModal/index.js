/* @flow */

import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';

import {
  Metric, Colors, ImageResource, Fonts, BasicStyles,
} from '../../Themes';

import {
  Text, Button, Icon,
} from '../../Elements';

type Props = {
  navigation: Object,
};

type State = {
}

const ICON_SIZE = 80;

export default class ComfirmModal extends React.Component<Props, State> {
  render() {
    const {
      title, descriptinon, type, onPressOk, titleBtnOk,
    } = this.props.navigation.state.params;

    return (
      <View style={styles.flexCenter}>
        <View
          style={styles.wrapperContainer}
        >
          <View style={BasicStyles.flexCenter}>
            <Icon source={type === 'success' ? ImageResource.IC_SuccessModal : ImageResource.IC_WarningModal} size={ICON_SIZE} />
            <Text style={{ marginVertical: Metric.space10 }} fontFamily={Fonts.Bold}>
              {title}
            </Text>
            <Text style={{textAlign: 'center'}} fontFamily={Fonts.SemiBold}>
              {descriptinon}
            </Text>
          </View>
          <View style={{ marginHorizontal: Metric.Space, height: 30, marginBottom: Metric.Space }}>
            <Button
              onPress={() => onPressOk()}
              style={styles.btnOk}
            >
              <Text fontFamily={Fonts.Bold} color={Colors.textWhite}>
                {titleBtnOk}
              </Text>
            </Button>
          </View>
          <Button
            onPress={() => this.props.navigation.pop()}
            style={{
              padding: Metric.Space, position: 'absolute', top: 0, left: 0,
            }}
          >
            <Icon source={ImageResource.IC_Close} size={Metric.iconSize15} />
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperContainer: {
    width: 300,
    height: 260,
    borderRadius: Metric.borderRadius10,
    backgroundColor: Colors.bgWhite,
  },
  smallContainer: {
    height: 200,
  },
  btnOk: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Metric.borderRadius10,
    backgroundColor: Colors.bgEC,
  },
});
