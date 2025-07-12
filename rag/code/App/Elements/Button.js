/* @flow */

import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity as RNTouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '@I18n';
import { TouchableOpacity as GestureTouchableOpacity } from 'react-native-gesture-handler';
import { Text, Icon as LocalIcon } from '@Elements';
import { Metric, Colors } from '../Themes';

export default class Button extends PureComponent {
  static defaultProps = {
    activeOpacity: 0.5,
    onPress: () => {},
    disabled: false,
    title: '',
    transparent: false,
    overflow: false,
    primary: false,
    success: false,
    light: false,
    warning: false,
    danger: false,
    dark: false,
    block: false,
    rounded: false,
    outline: false,
    small: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      click: false,
    };
    this.timer = null;
  }

  getValueByType(lightValue, infoValue, primaryValue, successValue, warningValue, dangerValue, darkValue) {
    const { light, info, primary, success, warning, danger, dark } = this.props;
    if (light) {
      return lightValue;
    }
    if (info) {
      return infoValue;
    }
    if (primary) {
      return primaryValue;
    }
    if (success) {
      return successValue;
    }
    if (warning) {
      return warningValue;
    }
    if (danger) {
      return dangerValue;
    }
    if (dark) {
      return darkValue;
    }
    return infoValue;
  }

  render() {
    const { children, overflow, testID, ...restProps } = this.props;
    const TouchableOpacity = overflow ? GestureTouchableOpacity : RNTouchableOpacity;
    if (children) {
      return (
        <TouchableOpacity testID={testID} {...restProps} onPress={() => this.onPress()}>
          {children}
        </TouchableOpacity>
      );
    }

    const {
      title,
      icon,
      containerStyle,
      block,
      rounded,
      outline,
      info,
      style,
      transparent,
      disabled,
      localIcon,
      titleColor: txtColor,
      small,
    } = restProps;
    const colorByType = this.getValueByType(
      Colors.light,
      Colors.info,
      Colors.primary,
      Colors.success,
      Colors.warning,
      Colors.danger,
      Colors.dark
    );
    let titleColor = txtColor || '#001335';
    let shadowStyle;
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    let borderRadius = 0;
    let borderWidth = 0;

    if (block || rounded) {
      shadowStyle = Platform.OS === 'android' ? styles.shadowAndroid : styles.shadowIOS;
      backgroundColor = colorByType;
      if (info) {
        titleColor = 'white';
      }
      if (disabled) {
        backgroundColor = Colors.disabled;
      }
    }

    if (block || outline) {
      borderRadius = Metric.borderRadius5;
    }

    if (rounded) {
      borderRadius = 22;
    }

    if (outline) {
      borderColor = colorByType;
      borderWidth = 1;
    }

    if (disabled) {
      if (!transparent) {
        backgroundColor = Colors.border;
      }
      titleColor = 'gray';
    }

    const buttonStyle = [
      styles.container,
      style,
      shadowStyle,
      {
        backgroundColor,
        borderRadius,
        borderColor,
        borderWidth,
        height: transparent ? undefined : small ? 32 : 44,
      },
      containerStyle,
    ];

    return (
      <TouchableOpacity
        testID={testID}
        {...restProps}
        style={!overflow && buttonStyle}
        onPress={() => this.onPress()}
        containerStyle={overflow && buttonStyle}
        disabled={restProps.disabled || this.state.click}
      >
        {icon && <Icon size={20} name={icon} style={[styles.icon]} color={titleColor} />}
        {localIcon && <LocalIcon size={18} source={localIcon} style={[styles.icon]} tintColor={titleColor} />}

        <Text
          preset={transparent ? 'default' : 'medium'}
          style={[
            styles.title,
            {
              color: titleColor,
              textTransform: transparent ? 'none' : 'uppercase',
            },
            style,
          ]}
          numberOfLines={1}
        >
          {I18n.t(title)}
        </Text>
      </TouchableOpacity>
    );
  }

  onPress() {
    this.setState({
      click: true,
    });
    this.props.onPress();

    this.timer = setTimeout(() => {
      this.setState({
        click: false,
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.setState({
      click: false,
    });
    clearTimeout(this.timer);
  }
}

Button.propTypes = {
  activeOpacity: PropTypes.number,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  overflow: PropTypes.bool,
  title: PropTypes.string,
  transparent: PropTypes.bool,
  primary: PropTypes.bool,
  success: PropTypes.bool,
  light: PropTypes.bool,
  warning: PropTypes.bool,
  danger: PropTypes.bool,
  dark: PropTypes.bool,
  block: PropTypes.bool,
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
  small: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: Metric.borderRadius10,
    backgroundColor: Colors.bgEC,
    flexDirection: 'row',
  },
  shadowIOS: {
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.3,
  },
  shadowAndroid: {
    minWidth: 100,
    elevation: 10,
  },
  title: {
    color: 'white',
  },
  icon: {
    marginRight: Metric.space5,
  },
  iconSize: {
    width: 20,
    height: 20,
  },
});
