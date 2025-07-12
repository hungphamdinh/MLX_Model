/* @flow */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Metric, Colors } from '../../Themes';

import { LangText, Icon, Text } from '../../Elements';

import IC_CLOSE from '../../Resources/icon/close.png';

type Props = {
  isFullScreen: boolean,
  title: string,
  allowAndroidBackPress: boolean,
  onRequestClose: Function,
  headerRight: Function,
  stickyNavBar: boolean,
  children: any,
};
type State = {};

export default class WrapperModal extends React.PureComponent<Props, State> {
  static defaultProps = {
    isFullScreen: false,
    allowAndroidBackPress: true,
    onRequestClose: () => null,
    stickyNavBar: false,
    backHandler: null,
  };

  componentDidMount() {
    if (Metric.isANDROID) {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  }

  componentWillUnmount() {
    if (Metric.isANDROID && this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleBackPress = () => {
    if (this.props.allowAndroidBackPress) {
      this.props.onRequestClose();
      return true;
    }
    return true;
  };

  render() {
    const { headerRight, isFullScreen, stickyNavBar, title, children } = this.props;
    return (
      <View
        style={[
          styles.wrapper,
          // isFullScreen && styles.noPadding,
          stickyNavBar && styles.paddingTopSticky,
        ]}
      >
        {!isFullScreen ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.miniBar} />
          </View>
        ) : null}
        <View style={[styles.container]}>
          <View style={[styles.navBarContainer]}>
            <TouchableOpacity style={styles.button} onPress={this.props.onRequestClose}>
              <Icon source={IC_CLOSE} />
            </TouchableOpacity>
            <View style={styles.navBar}>
              <Text preset="medium" numberOfLines={1} text={title} />
            </View>

            <View style={styles.button}>{headerRight && headerRight()}</View>
          </View>
          {children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Metric.isIphoneX ? 60 : 30,
  },
  // noPadding: {
  //   paddingTop: 0,
  // },
  miniBar: {
    width: 60,
    height: 5,
    borderRadius: 10,
    backgroundColor: Colors.bgWhite,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: Colors.bgMain,
    overflow: 'hidden',
  },
  isFullScreen: {
    paddingTop: Metric.isIOS ? 20 : 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  navBarContainer: {
    backgroundColor: Colors.bgWhite,
    height: 50,
    flexDirection: 'row',
  },
  stickyNavBar: {
    position: 'absolute',
    top: 0,
    width: Metric.ScreenWidth,
    zIndex: 1,
  },
  paddingTopSticky: {
    paddingTop: Metric.isIOS ? 20 : 0,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
