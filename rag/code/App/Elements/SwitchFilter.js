/* @flow */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LangText from './LangText';
import { Colors, Metric } from '../Themes';

type Props = {
  allTextButton: string,
  myTextButton: string,
  onPress: Function
};

type State = {
  isActiveAll: boolean
}

export default class SwitchFilter extends React.Component<Props, State> {
  state = {
    isActiveAll: true,
  }

  onPress = (isActiveAll: boolean) => {
    const { isActiveAll: isActiveAllState } = this.state;
    if (isActiveAllState !== isActiveAll) {
      const { onPress } = this.props;
      this.setState({
        isActiveAll,
      });
      if (onPress) onPress(isActiveAll);
    }
  }

  render() {
    const { isActiveAll } = this.state;
    const { allTextButton, myTextButton } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={[isActiveAll ? styles.buttonActive : styles.button]}
            onPress={() => this.onPress(true)}
          >
            <LangText style={styles.buttonText}>
              {allTextButton}
            </LangText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[!isActiveAll ? styles.buttonActive : styles.button]}
            onPress={() => this.onPress(false)}
          >
            <LangText style={styles.buttonText}>
              {myTextButton}
            </LangText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgWhite,
    padding: Metric.space10,
    paddingBottom: Metric.isIphoneX ? Metric.Space : Metric.space10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

  },
  wrapper: {
    backgroundColor: Colors.bgSemiGray,
    flexDirection: 'row',
    borderRadius: Metric.space10,
  },
  button: {
    backgroundColor: Colors.bgSemiGray,
    margin: Metric.space10 - 3,
    flex: 0.8,
    borderRadius: Metric.space10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.bgEC,
    flex: 1,
    borderRadius: Metric.space10 - 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textWhite,
  },
});
