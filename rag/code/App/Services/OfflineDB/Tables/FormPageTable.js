import createTable from './BaseTable';

export default createTable({
  name: 'formPage',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formGuid',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'formId',
      type: 'string',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'pageIndex',
      type: 'number',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
    {
      name: 'formQuestionTypeCategoryId',
      type: 'number',
    },
    {
      name: 'formPageGroupGuid',
      type: 'string',
    },
    {
      name: 'formPageGroupId',
      type: 'number',
    },
    {
      name: 'formPageGroupName',
      type: 'string',
    },
  ],
});
