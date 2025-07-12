import createTable from './BaseTable';

export default createTable({
  name: 'formPageGroup',
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
      isOptional: true,
    },
    {
      name: 'formId',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
