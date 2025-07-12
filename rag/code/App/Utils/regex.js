import { azureRestrictedTerms } from '../Config/Constants';

/* eslint-disable no-restricted-syntax */
export const checkEmailSavills = (NameOrEmail, regex) => {
  let isSavillsAccount = false;
  regex.map((item) => {
    const restoredRegex = new RegExp(item);
    if (restoredRegex.test(NameOrEmail)) {
      isSavillsAccount = true;
    }
  });
  return isSavillsAccount;
};

export function parseStringTemplate(str, obj) {
  const parts = str.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
  const args = str.match(/[^{\}]+(?=})/g) || [];
  const parameters = args.map((argument) => obj[argument] || (obj[argument] === undefined ? '' : obj[argument]));
  return String.raw({ raw: parts }, ...parameters);
}

export function isParamValid(params) {
  const restrictedTermRegex = azureRestrictedTerms.map(
    (term) => new RegExp(term.toLowerCase().replace('()', '(\\s*)\\(.*\\)(\\s*)'))
  );

  const isValidParam = restrictedTermRegex.every((regex) => !regex.test(params.toLowerCase()));
  return isValidParam;
}
