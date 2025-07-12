import IDGenerator, { generateInspectionUUID, TableNames } from './IDGenerator';

describe('IDGenerator', () => {
  const localIds = {
    [TableNames.form]: ['92920d0c-79b9-481f-8530-19849427d2c1', 'cf64198c-a1fb-4b03-a4b1-15056e3df685'],
  };

  IDGenerator.localIds = localIds;

  it('should generate IDs that are UUIDv4 strings', () => {
    const tableName = 'formPage';

    const id = generateInspectionUUID(tableName);

    expect(id).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/);
  });
  it('should throw an error when trying to instantiate a new instance', () => {
    expect(() => new IDGenerator()).toThrow();
  });
});
