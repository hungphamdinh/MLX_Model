import createTable from './BaseTable';

export default createTable({
  name: 'inspectionProperty',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'address',
      type: 'string',
    },
    {
      name: 'postalCode',
      type: 'string',
    },
    {
      name: 'unitNumber',
      type: 'string',
    },
    {
      name: 'notes',
      type: 'string',
    },
    {
      name: 'isActive',
      type: 'boolean',
    },
    {
      name: 'propertyType',
      type: 'string',
    },
    {
      name: 'users',
      type: 'string',
    },
    {
      name: 'creationTime',
      type: 'string',
    },
    {
      name: 'lastModificationTime',
      type: 'string',
    },
    {
      name: 'image',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'floor',
      type: 'string',
    },
    {
      name: 'city',
      type: 'string',
    },
    {
      name: 'building',
      type: 'string',
    },
    {
      name: 'district',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
