import createTable from './BaseTable';

export default createTable({
  name: 'status',
  columns: [
    {
      name: 'guid',
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
      name: 'name',
      type: 'string',
    },
    {
      name: 'position',
      type: 'number',
    },
    {
      name: 'isDefault',
      type: 'boolean',
    },
    {
      name: 'isIssueClosed',
      type: 'boolean',
    },
    {
      name: 'isIssueCancelled',
      type: 'boolean',
    },
    {
      name: 'isDeleted',
      type: 'boolean',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
