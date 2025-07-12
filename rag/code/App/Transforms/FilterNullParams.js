/* @flow */

import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

export default (obj: Object) => omitBy(obj, isNil);
