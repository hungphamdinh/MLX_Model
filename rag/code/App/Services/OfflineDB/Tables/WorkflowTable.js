import createTable from './BaseTable';

export default createTable({
  name: 'workflow',
  columns: [
    {
      name: 'guid',
      type: 'string',
    },
    {
      name: 'statusId',
      type: 'string',
      isOptional: true,
    },
    {
      name: 'trackerId',
      type: 'string',
    },
    {
      name: 'roleId',
      type: 'string',
    },
    {
      name: 'assignedId',
      type: 'string',
    },
    {
      name: 'priorityId',
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
      name: 'formGuid',
      type: 'string',
    },
    {
      name: 'formId',
      type: 'string',
    },
    {
      name: 'subject',
      type: 'string',
    },
    {
      name: 'description',
      type: 'string',
    },
    {
      name: 'dueDate',
      type: 'string',
    },
    {
      name: 'startDate',
      type: 'string',
    },
    {
      name: 'closedDate',
      type: 'string',
    },
    {
      name: 'rescheduleDate',
      type: 'string',
    },
    {
      name: 'rescheduleRemark',
      type: 'string',
    },
    {
      name: 'remoteId',
      type: 'number',
    },
  ],
});
