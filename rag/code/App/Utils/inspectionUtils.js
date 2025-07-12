import _ from 'lodash';
import * as Yup from 'yup';
import I18n from '@I18n';
import { formItemTypes } from '@Config/Constants';

function getStringFromArray({ isProperty = false }, ...params) {
  const results = [];
  params.forEach((value) => {
    if (_.size(value) > 0) {
      results.push(value);
    }
  });
  return results.join(!isProperty ? ', ' : '/ ');
}

export function getAddressForProperty(property, isProperty) {
  return !isProperty
    ? getStringFromArray({}, property.unitNumber, property.city)
    : getStringFromArray({ isProperty }, property.unitNumber, property.floor, property.street, property.building);
}

export function getValidationForWorkflow(properties) {
  if (_.size(properties) === 0) return {};
  const validations = {};
  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const objectRequired = Yup.object().required(requiredMessage);
  const stringRequired = Yup.string().required(requiredMessage);
  const numberRequired = Yup.number().required(requiredMessage);
  const mappings = [
    {
      workflowField: 'StatusId',
      name: 'statusId',
      validate: numberRequired,
    },
    {
      workflowField: 'PriorityId',
      name: 'priorityId',
      validate: numberRequired,
    },
    {
      workflowField: 'TrackerId',
      name: 'trackerId',
      validate: numberRequired,
    },
    {
      workflowField: 'StartDate',
      name: 'startDate',
      validate: stringRequired,
    },
    {
      workflowField: 'ClosedDate',
      name: 'closedDate',
      validate: stringRequired,
    },
    {
      workflowField: 'DueDate',
      name: 'dueDate',
      validate: stringRequired,
    },
    {
      workflowField: 'EstimatedHours',
      name: 'estimatedHours',
      validate: objectRequired,
    },
    {
      workflowField: 'DoneRatio',
      name: 'doneRatio',
      validate: numberRequired,
    },
    {
      workflowField: 'RescheduleRemark',
      name: 'rescheduleRemark',
      validate: stringRequired,
    },
  ];
  mappings.forEach((item) => {
    const wfProperty = properties.find((property) => property.propertyName === item.workflowField);
    if (wfProperty && wfProperty.isRequired) {
      validations[item.name] = item.validate;
    }
  });
  return validations;
}

export function calculateEstimatedSizeForForm(form) {
  let estimateSectionSize = 0;
  const estimateQuestionSize = 165;
  const bottomActionSize = 60;
  const headerHeight = 60;
  const formPages = _.get(form, 'formPages') || [];
  const minQuestionInPage = _.min(formPages.map((formPage) => _.size(formPage.formQuestions))) || 0;
  estimateSectionSize = headerHeight + minQuestionInPage * estimateQuestionSize + bottomActionSize;
  return {
    estimateSectionSize,
    estimateQuestionSize,
  };
}

export function getFormStructureJson(form) {
  const result = {};
  _.forEach(
    form.formPages,
    (formPage) => (result[formPage.id] = _.map(formPage.formQuestions, (formQuestion) => formQuestion.id))
  );
  return result;
}

export const isHKQuestionType = (data) =>
  [
    formItemTypes.METER_READING,
    formItemTypes.INVENTORY_QUANTITY,
    formItemTypes.VISUAL_DEFECTS,
    formItemTypes.MARCHING_IN_OUT,
  ].includes(data);
