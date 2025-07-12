import { transformDeltaChangesToTables } from './formEditorTransformer';
const deltaChangeMock = {
  formPage: { created: [], updated: [], deleted: [] },
  form: { created: [], updated: [], deleted: [] },
  formCategory: { created: [], updated: [], deleted: [] },
  formGroup: { created: [], updated: [], deleted: [] },
  formQuestion: { created: [], updated: [], deleted: [] },
  formQuestionType: { created: [], updated: [], deleted: [] },
  inspectionProperty: { created: [], updated: [], deleted: [] },
  formStatus: { created: [], updated: [], deleted: [] },
  formQuestionAnswer: {
    created: [],
    updated: [
      {
        id: '9d784501-cdd4-4cfb-bfb5-96eb856f68bc',
        label: 'Yes',
        value: '9d784501-cdd4-4cfb-bfb5-96eb856f68bc',
        formQuestionAnswerTemplateId: null,
        formQuestionGuid: '75df80d9-e2b2-49ab-8bc1-c0ac820ad3c4',
      },
      {
        id: '2aff6824-1ada-4138-a3f2-76d40b102a88',
        label: 'No',
        value: '2aff6824-1ada-4138-a3f2-76d40b102a88',
        formQuestionAnswerTemplateId: null,
        formQuestionGuid: '75df80d9-e2b2-49ab-8bc1-c0ac820ad3c4',
      },
    ],
    deleted: [],
  },
  formUserAnswerQuestion: { created: [], updated: [], deleted: [] },
  formUserAnswer: { created: [], updated: [], deleted: [] },
  workflow: { created: [], updated: [], deleted: [] },
  inspection: { created: [], updated: [], deleted: [] },
  status: { created: [], updated: [], deleted: [] },
  priority: { created: [], updated: [], deleted: [] },
  formUserAnswerQuestionImage: { created: [], updated: [], deleted: [] },
  formUserAnswerQuestionOption: {
    created: [
      {
        id: '05603b10-cd4a-4023-a951-0b49d3466e14',
        label: 'No',
        value: 'c0efca25-ffb0-4017-95a9-51184b197636',
        formQuestionAnswerTemplateId: 2,
        formQuestionGuid: '81612f64-708b-480f-9f2a-f36e56e9ae1f',
      },
    ],
    updated: [
      {
        id: '0820772a-b3ca-43d0-8980-c27b058a0674',
        label: 'Poor',
        value: '04916b3d-6a24-4717-9b2f-84aff9162a50',
        formQuestionAnswerTemplateId: 5,
        formQuestionGuid: '407ba20b-6ff3-4682-84e6-801742403b74',
      },
      {
        id: '8f9c7bef-6898-437c-a380-8729214809f2',
        label: 'Agree',
        value: '4e3246ab-4f66-4445-9356-3e5d55fac652',
        formQuestionAnswerTemplateId: 6,
        formQuestionGuid: '1b8a8b80-2f05-4fab-9fc5-dbcc2c62177d',
      },
    ],
    deleted: [],
  },
  signatureImage: { created: [], updated: [], deleted: [] },
  formQuestionAnswerTemplate: { created: [], updated: [], deleted: [] },
  formUserAnswerQuestionMarching: { created: [], updated: [], deleted: [] },
};

describe('transformDeltaChangesToTables', () => {
  it('should handle empty delta changes', () => {
    const deltaChanges = {};
    const expectedResults = {};
    const actualResults = transformDeltaChangesToTables(deltaChanges);
    expect(actualResults).toEqual(expectedResults);
  });
});
