import createTable from './BaseTable';

export default createTable({
  name: 'formStatus',
  columns: [
    {
      name: 'code',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'order',
      type: 'number',
    },
    {
      name: 'moduleId',
      type: 'string',
    },
    {
      name: 'colorCode',
      type: 'string',
    },
    {
      name: 'borderColorCode',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
