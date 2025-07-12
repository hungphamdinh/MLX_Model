/* @flow */

import React from 'react';
import get from 'lodash/get';
import Text from './Text';
import AppContext from '../Context/AppContext';

type Props = {
  children: any
};

export default class LangText extends React.Component<Props> {
  static contextType = AppContext


  static getText = (key: string, currentLanguage: Object) => {
    const text = get(currentLanguage, key, key);
    return text;
  }

  shouldComponentUpdate() {
    return false;
  }


  render() {
    const { children, ...anyProps } = this.props;
    const { currentLanguage } = this.context;
    const text = get(currentLanguage, children, children);
    return (
      <Text
        {...anyProps}
      >
        {text}
      </Text>

    );
  }
}
