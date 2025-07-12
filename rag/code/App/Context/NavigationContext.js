/* @flow */
import React from 'react';

const defaultValue = {
  prevRouteName: '',
  currentRouteName: '',

};

const context = React.createContext(defaultValue);
const { Provider, Consumer } = context;

export default context;
export {
  Provider as NavigationProvider,
  Consumer as NavigationConsumer,
  defaultValue as NavigationDefaultValue,
};
