import createTable from './BaseTable';

export default createTable({
  name: 'formQuestion',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formPageGuid',
      type: 'string',
    },
    {
      name: 'formPageId',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'formQuestionTypeId',
      type: 'string',
    },
    {
      name: 'isMandatory',
      type: 'boolean',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'isAllowComment',
      type: 'boolean',
    },
    {
      name: 'isMultiAnswer',
      type: 'boolean',
    },
    {
      name: 'isIncludeTime',
      type: 'boolean',
    },
    {
      name: 'isImage',
      type: 'boolean',
    },
    {
      name: 'isDeclareQuantity',
      type: 'boolean',
    },
    {
      name: 'isRequiredImage',
      type: 'boolean',
    },
    {
      name: 'isRequiredLocation',
      type: 'boolean',
    },
    {
      name: 'isDeclareQuantityMandatory',
      type: 'boolean',
    },
    {
      name: 'isScore',
      type: 'boolean',
    },
    {
      name: 'labelFrom',
      type: 'string',
    },
    {
      name: 'labelTo',
      type: 'string',
    },
    {
      name: 'questionIndex',
      type: 'number',
    },
    {
      name: 'groupCode',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
    {
      name: 'budgetCode',
      type: 'string',
    },
    {
      name: 'projectTypeId',
      type: 'number',
    },
  ],
});
