/* @flow */
import _ from 'lodash';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const generateGUID = () => uuidv4();


export const getSecurePhoneNumber = (phone) => {
  if (_.size(phone) > 5) {
    return `(*** *** ${phone.substr(_.size(phone) - 3, _.size(phone))})`;
  }
  return '';
};
