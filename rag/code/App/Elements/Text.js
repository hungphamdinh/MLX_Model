/* @flow */

import React, { useCallback, useMemo, useRef } from 'react';
import { Text as RNText, Platform } from 'react-native';
import i18n from '@I18n';
import PropTypes from 'prop-types';
import { Colors } from '../Themes';

const H1 = 'H1';
const H2 = 'H2';
const H3 = 'H3';
const P1 = 'P1';
const P2 = 'P2';
const P3 = 'P3';

export const typeShape = PropTypes.oneOf([H1, H2, H3, P1, P2, P3]);

const BASE = {
  fontFamily: 'Gotham-Book',
  color: Colors.text,
  fontSize: 13,
};

const presets = {
  default: BASE,
  bold: { ...BASE, fontFamily: 'Gotham-Bold', fontWeight: 'bold' },
  medium: { ...BASE, fontFamily: 'Gotham-Medium', fontWeight: 'bold' },
};

const styles = {
  H1: {
    fontSize: 16,
  },
  H2: {
    fontSize: 15,
  },
  H3: {
    fontSize: 14,
  },
  P1: {
    fontSize: 14,
  },
  P2: {
    fontSize: 12,
  },
  P3: {
    fontSize: 10,
  },
};

const Text = (props) => {
  const { preset, style: styleOverride, text, typo = 'P1', children, ...restProps } = props;
  const lineRef = useRef(0);

  const style = presets[preset] || presets.default;
  const textStyle = useMemo(() => {
    const combinedStyles = [style, styles[typo]];
    if (Array.isArray(styleOverride)) {
      combinedStyles.push(...styleOverride);
    } else {
      combinedStyles.push(styleOverride);
    }
    return combinedStyles.flat();
  }, [style, styles[typo], styleOverride]);

  const fontSize = useMemo(() => [...textStyle].reverse().find((item) => item?.fontSize)?.fontSize || 14, [textStyle]);

  const onTextLayout = useCallback(({ nativeEvent: { lines: { length } } }) => {
    lineRef.current = length;
  }, []);

  const customTextStyle = useCallback(() => {
    if (lineRef.current && Platform.OS === 'android') {
      return {
        lineHeight: fontSize * 1.4,
      };
    }
    return undefined;
  }, [lineRef]);

  return (
    <RNText style={[...textStyle, customTextStyle()]} onTextLayout={onTextLayout} {...restProps}>
      {text ? i18n.t(text) : children}
    </RNText>
  );
};

export default Text;
