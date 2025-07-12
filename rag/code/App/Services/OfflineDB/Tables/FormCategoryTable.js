import createTable from './BaseTable';

export default createTable({
  name: 'formCategory',
  columns: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
