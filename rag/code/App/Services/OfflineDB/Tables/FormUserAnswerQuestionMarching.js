import createTable from './BaseTable';

export default createTable({
  name: 'formUserAnswerQuestionMarching',
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
      name: 'marching',
      type: 'string',
    },
    {
      name: 'isPhotographTaken',
      type: 'boolean',
      isOptional: true,
    },
    {
      name: 'texts',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
