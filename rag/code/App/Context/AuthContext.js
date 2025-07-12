/* @flow */
import React from 'react';

const defaultValue = {
  accessToken: '',
  encToken: '',
  accessTokenAPI: '',
  isLogined: false,
  hasAccountData: false,
};

const AuthContext = React.createContext(defaultValue);
const { Provider, Consumer } = AuthContext;

export default AuthContext;
export {
  Provider as AuthProvider,
  Consumer as AuthConsumer,
  defaultValue as AuthDefaultValue,
};
