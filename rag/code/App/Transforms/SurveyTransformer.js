import _ from 'lodash';
import I18n from '@I18n';

export const transformListUnitTypes = (data) =>
  _.map(data, (cat) => ({
    name: I18n.t(`SURVEY_UNIT_TYPES_${cat.code.toUpperCase()}`),
    id: cat.id,
  }));

export const transformTenantRoles = (data) =>
  _.map(data, (cat) => ({
    name: I18n.t(`SURVEY_TENANT_ROLES_${cat.code.toUpperCase()}`),
    id: cat.code,
  }));

export const calculateTotalScore = (formPages = []) => {
  const scores = [];
  formPages.map((item) =>
    _.map(item.formQuestions, (question) => {
      if (question.isScore) {
        if (question.uaqAnswerNumeric) {
          const answerNumeric = question.uaqAnswerNumeric.toString().includes(',')
            ? question.uaqAnswerNumeric.toString().replace(',', '.')
            : question.uaqAnswerNumeric;
          scores.push(answerNumeric ? Number(answerNumeric) : 0);
        }
      }
      return null;
    })
  );
  const totalScore = scores.length > 0 ? scores.reduce((accumulator, curr) => accumulator + curr, 0) : 0;
  return totalScore;
};
