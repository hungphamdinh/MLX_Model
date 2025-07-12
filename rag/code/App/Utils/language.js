/**
 * Created by thienmd on 9/9/20
 */

import _ from 'lodash';
import get from 'lodash/get';

export const getLanguageData = (languages, languageID) => {
  const language = languages.find((item) => item.id === languageID) || {};
  return get(language, 'data') || {};
};

export const getPickerLanguageCode = (languageId) => _.includes(['en', 'vi', 'zh-CN'], languageId) ? languageId : 'en';
