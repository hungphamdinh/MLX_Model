import createTable from './BaseTable';

export default createTable({
  name: 'formSubQuestionAnswer',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formSubQuestionGuid',
      type: 'string',
    },
    {
      name: 'formSubQuestionId',
      type: 'number',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
