import createTable from './BaseTable';

export default createTable({
  name: 'formSubUserAnswerQuestionOption',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formUserAnswerQuestionGuid',
      type: 'string',
    },
    {
      name: 'formUserAnswerQuestionId',
      type: 'string',
    },
    {
      name: 'formQuestionAnswerGuid',
      type: 'string',
    },
    {
      name: 'formQuestionAnswerId',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
