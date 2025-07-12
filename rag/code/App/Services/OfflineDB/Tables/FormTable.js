import createTable from './BaseTable';

export default createTable({
  name: 'form',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formName',
      type: 'string',
    },
    {
      name: 'formGroupId',
      type: 'string',
    },
    {
      name: 'formCategoryId',
      type: 'string',
    },
    {
      name: 'moduleId',
      type: 'string',
    },
    {
      name: 'statusId',
      type: 'string',
    },
    {
      name: 'tenantId',
      type: 'string',
    },
    {
      name: 'creatorUserId',
      type: 'string',
    },
    {
      name: 'header',
      type: 'string',
    },
    {
      name: 'footer',
      type: 'string',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'publicTime',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
    },
    {
      name: 'type',
      type: 'number',
    },
  ],
});
