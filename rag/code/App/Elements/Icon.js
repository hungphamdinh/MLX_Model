/* @flow */

import React, { PureComponent } from 'react';
import Image from './Image';
import { Metric } from '../Themes';

type Props = {
  source: number,
  style: any,
  size: number,
};
type State = {};

export default class Button extends PureComponent<Props, State> {
  click: boolean;

  static defaultProps = {
    size: 15,
  };

  render() {
    const { style, size, source, ...restProps } = this.props;
    return <Image {...restProps} source={source} resizeMode="contain" style={[{ width: size, height: size }, style]} />;
  }
}
