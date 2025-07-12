import createTable from './BaseTable';

export default createTable({
  name: 'formUserAnswerQuestionImage',
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
      name: 'imageGuid',
      type: 'string',
    },
    {
      name: 'files',
      type: 'string',
    },
    {
      name: 'path',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'longitude',
      type: 'number',
    },
    {
      name: 'latitude',
      type: 'number',
    },
    {
      name: 'workflowGuid',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
