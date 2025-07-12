import createTable from './BaseTable';

export default createTable({
  name: 'formUserAnswer',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'parentId',
      type: 'string',
    },
    {
      name: 'parentGuid',
      type: 'string',
    },
    {
      name: 'moduleId',
      type: 'string',
    },
    {
      name: 'userAnswerId',
      type: 'string',
    },
    {
      name: 'unitId',
      type: 'string',
    },
    {
      name: 'statusId',
      type: 'string',
    },
    {
      name: 'fullUnitCode',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
