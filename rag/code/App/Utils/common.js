import moment from 'moment';
import I18n from '@I18n';
import LocaleConfig from '../Config/LocaleConfig';

export function formatDateTime(date) {
  if (!date) {
    return undefined;
  }
  return moment(date).format(LocaleConfig.fullDateTimeFormat);
}

export const getPasswordConfigCaption = (setting) => {
  const { requireDigit, requireLowercase, requireNonAlphanumeric, requireUppercase, requiredLength } = setting;
  const addOns = [I18n.t('PASSWORD_VALIDATE_{0}_LENGTH', undefined, requiredLength)];
  if (requireDigit) {
    addOns.push('PASSWORD_VALIDATE_NUMBER');
  }
  if (requireUppercase) {
    addOns.push('PASSWORD_VALIDATE_UPPERCASE');
  }
  if (requireLowercase) {
    addOns.push('PASSWORD_VALIDATE_LOWERCASE');
  }

  if (requireNonAlphanumeric) {
    addOns.push('PASSWORD_VALIDATE_SPECIAL_CHARACTER');
  }

  return addOns;
};

export const validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

export const getCompanyRepresentativeName = (company) => {
  if (!company) {
    return '';
  }
  return `${company.companyName ? company.companyName + ' - ' : ''}${company.representative}`;
};
