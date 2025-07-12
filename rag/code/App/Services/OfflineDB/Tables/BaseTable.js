import { tableSchema } from '@nozbe/watermelondb';

const createTable = ({ name, columns }) =>
  tableSchema({
    name,
    columns: [
      ...columns,
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  });

export default createTable;
