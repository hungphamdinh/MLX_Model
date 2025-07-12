import createTable from './BaseTable';

export default createTable({
  name: 'formSubUserAnswerQuestion',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formUserAnswerGuid',
      type: 'string',
    },
    {
      name: 'formUserAnswerId',
      type: 'string',
    },
    {
      name: 'questionId',
      type: 'string',
    },
    {
      name: 'questionGuid',
      type: 'string',
    },
    {
      name: 'answerContent',
      type: 'string',
    },
    {
      name: 'answerDate',
      type: 'string',
    },
    {
      name: 'answerNumeric',
      type: 'number',
    },
    {
      name: 'comment',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
