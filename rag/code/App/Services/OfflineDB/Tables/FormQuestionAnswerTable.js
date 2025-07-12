import createTable from './BaseTable';

export default createTable({
  name: 'formQuestionAnswer',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'formQuestionGuid',
      type: 'string',
    },
    {
      name: 'formQuestionId',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'formQuestionAnswerTemplateId',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
