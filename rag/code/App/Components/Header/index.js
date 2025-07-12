/* @flow */


import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  View, StyleSheet,
} from 'react-native';
import {Text} from '../../Elements';
import { Colors, Metric } from '../../Themes';

const HEADER_HEIGHT = Metric.isIphoneX ? 100 : 70;

type Props = {
  title: string,
  isCustom: boolean,
  headerColor: string,
  renderViewLeft: Function,
  renderViewRight: Function,
  renderViewCustom: Function,
  onLayout: any,
};
type State = {};

export default class Header extends Component<Props, State> {
  static defaultProps = {
    headerColor: Colors.bgWhite,
  };

  renderTitle = () => {
    if (this.props.title && !isEmpty(this.props.title)) {
      return (
          <View style={styles.titleContainer} key="ViewTitle">
              <Text preset="bold" numberOfLines={1}>
                  {this.props.title}
              </Text>
          </View>
      );
    }
    return <View style={{ flex: 1 }} key="ViewTitle" />;
  }

  renderViewLeft = () => {
    if (this.props.renderViewLeft) {
      return (
          <View style={styles.viewLeft} key="ViewLeft">
              {this.props.renderViewLeft}
          </View>
      );
    }
    return <View style={{ flex: 0.5 }} key="ViewLeft" />;
  }

  renderViewRight = () => {
    if (this.props.renderViewRight) {
      return (
          <View style={styles.viewRight} key="ViewRight">
              {this.props.renderViewRight}
          </View>
      );
    }
    return <View style={{ flex: 0.5 }} key="ViewRight" />;
  }


  render() {
    const { headerColor, onLayout } = this.props;
    return (
        <View style={[styles.container, { backgroundColor: headerColor }]} onLayout={onLayout}>
            {Metric.isIOS && <View style={{ height: 20 }} />}
            {Metric.isIphoneX && <View style={{ height: 30 }} />}
            <View style={styles.wrapper}>
                {
            this.props.isCustom
              ? this.props.renderViewCustom
              : [
                this.renderViewLeft(),
                this.renderTitle(),
                this.renderViewRight(),
              ]
          }
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    width: Metric.ScreenWidth,
    zIndex: 90,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  viewLeft: {
    // backgroundColor: 'pink',
    flex: 0.5,
    justifyContent: 'center',
  },
  viewRight: {
    // backgroundColor: 'white',
    flex: 0.7,
    justifyContent: 'center',
  },
});
