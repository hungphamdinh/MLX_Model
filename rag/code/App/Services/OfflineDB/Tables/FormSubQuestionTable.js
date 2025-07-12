import createTable from './BaseTable';

export default createTable({
  name: 'formSubQuestion',
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
      type: 'number',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'isMultiAnswer',
      type: 'boolean',
    },
    {
      name: 'formQuestionTypeId',
      type: 'number',
    },
    {
      name: 'isDescriptionDefined',
      type: 'boolean',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
