import createTable from './BaseTable';

export default createTable({
  name: 'formQuestionType',
  columns: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
