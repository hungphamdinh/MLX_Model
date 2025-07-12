import createTable from './BaseTable';

export default createTable({
  name: 'signatureImage',
  columns: [
    {
      name: 'guid',
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
      name: 'name',
      type: 'string',
    },
    {
      name: 'workflowGuid',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
    {
      name: 'fileName',
      type: 'string',
    },
    {
      name: 'fileUrl',
      type: 'string'
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'referenceId',
      type: 'string',
    },
    {
      name: 'moduleName',
      type: 'string',
    }
  ],
});
