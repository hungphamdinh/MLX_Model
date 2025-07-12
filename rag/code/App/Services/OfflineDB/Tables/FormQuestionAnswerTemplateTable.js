import createTable from './BaseTable';

export default createTable({
  name: 'formQuestionAnswerTemplate',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'group_code',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'icon',
      type: 'string',
    },
    {
      name: 'colorCode',
      type: 'string',
    },
    {
      name: 'remote_id',
      type: 'number',
    },
  ],
});
