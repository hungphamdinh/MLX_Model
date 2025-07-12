import createTable from './BaseTable';

export default createTable({
  name: 'inspection',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'sourceId',
      type: 'string',
    },
    {
      name: 'inspectionPropertyId',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
    {
      name: 'isRequiredLocation',
      type: 'boolean',
    },
    {
      name: 'isRequiredSignature',
      type: 'boolean',
    },
    {
      name: 'signature',
      type: 'string',
    },
    {
      name: 'team',
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
      name: 'lastModificationTime',
      type: 'string',
    },
    {
      name: 'teamAssignee',
      type: 'string',
    },
  ],
});
