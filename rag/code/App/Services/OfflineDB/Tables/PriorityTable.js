import createTable from './BaseTable';

export default createTable({
  name: 'priority',
  columns: [
    {
      name: 'guid',
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
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'isDefault',
      type: 'boolean',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
