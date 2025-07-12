/**
 * Created by thienmd on 9/7/20
 */

import { ActionType } from '../Config/Constants';
import { convertSubmitDataFromFormEditor } from './InspectionTransformer';

describe('convertSubmitDataFromFormEditor', () => {
  const formPage1 = {
    id: 1,
    name: 'Form Page 1',
    formQuestions: [{ id: 1, question: 'Question 1' }],
  };
  const formPage2 = {
    id: 2,
    name: 'Form Page 2',
    formQuestions: [{ id: 2, question: 'Question 2' }],
  };

  it('returns adds array when originalData is null', () => {
    const formData = {
      name: 'Form',
      formCategoryId: 1,
      isPublish: true,
      formPages: [formPage1, formPage2],
    };
    const result = convertSubmitDataFromFormEditor(formData, null);
    expect(result.adds).toEqual([formPage1, formPage2]);
    expect(result.removes).toEqual([]);
    expect(result.updates).toEqual([]);
  });

  it('returns adds array when add new form page', () => {
    const originalData = {
      id: 1,
      name: 'Form',
      formCategoryId: 1,
      isPublish: true,
      formPages: [formPage1],
    };
    const formData = {
      id: 1,
      name: 'Form',
      formCategoryId: 1,
      isPublish: true,
      formPages: [
        formPage1,
        {
          name: 'Form Page 2',
          formQuestions: [{ question: 'Question 2' }],
        },
      ],
    };
    const result = convertSubmitDataFromFormEditor(formData, originalData);
    expect(result.adds).toEqual([formData.formPages[1]]);
    expect(result.removes).toEqual([]);
    expect(result.updates).toEqual([
      {
        ...formPage1,
        actionType: undefined,
        adds: [],
        removes: [],
        updates: formPage1.formQuestions,
      },
    ]);
  });

  it('returns removes array when form pages are removed', () => {
    const formData = {
      name: 'Form',
      formCategoryId: 1,
      isPublish: true,
      formPages: [formPage1],
    };
    const originalData = {
      id: 1,
      name: 'Form',
      formCategoryId: 1,
      isPublish: true,
      formPages: [formPage1, formPage2],
    };
    const result = convertSubmitDataFromFormEditor(formData, originalData);
    expect(result.adds).toEqual([]);
    expect(result.removes).toEqual([formPage2]);
    expect(result.updates).toEqual([
      {
        ...formPage1,
        adds: [],
        removes: [],
        updates: formPage1.formQuestions,
      },
    ]);
  });
});

// test('update description for question', () => {
//   const formObject = {
//     formPages: [
//       {
//         formQuestions: [
//           {
//             formPageId: 142,
//             isMandatory: false,
//             isActive: true,
//             isAllowComment: false,
//             isMultiAnswer: false,
//             isIncludeTime: false,
//             isImage: false,
//             labelFrom: '',
//             labelTo: '',
//             questionType: {
//               id: 1,
//               name: ' Multiple Choice',
//             },
//             answers: [
//               {
//                 description: '121',
//               },
//             ],
//             description: 'hghg',
//           },
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   const originalObject = {
//     formPages: [
//       {
//         formQuestions: [
//           {
//             formPageId: 142,
//             isMandatory: false,
//             isActive: true,
//             isAllowComment: false,
//             isMultiAnswer: false,
//             isIncludeTime: false,
//             isImage: false,
//             labelFrom: '',
//             labelTo: '',
//             questionType: {
//               id: 1,
//               name: ' Multiple Choice',
//             },
//             answers: [
//               {
//                 description: '121',
//               },
//             ],
//             description: 'test change question',
//           },
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   const wantObject = {
//     formPages: [
//       {
//         formQuestions: [
//           {
//             actionType: 'UPDATE',
//             formPageId: 142,
//             isMandatory: false,
//             isActive: true,
//             isAllowComment: false,
//             isMultiAnswer: false,
//             isIncludeTime: false,
//             isImage: false,
//             labelFrom: '',
//             labelTo: '',
//             questionType: {
//               id: 1,
//               name: ' Multiple Choice',
//             },
//             answers: [
//               {
//                 description: '121',
//               },
//             ],
//             description: 'hghg',
//           },
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   expect(convertSubmitDataFromFormEditor(formObject, originalObject)).toBe(wantObject);
// });
//
//
// test('test delete question', () => {
//   const formObject = {
//     formPages: [
//       {
//         formQuestions: [
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   const originalObject = {
//     formPages: [
//       {
//         formQuestions: [
//           {
//             formPageId: 142,
//             isMandatory: false,
//             isActive: true,
//             isAllowComment: false,
//             isMultiAnswer: false,
//             isIncludeTime: false,
//             isImage: false,
//             labelFrom: '',
//             labelTo: '',
//             questionType: {
//               id: 1,
//               name: ' Multiple Choice',
//             },
//             answers: [
//               {
//                 description: '121',
//               },
//             ],
//             description: 'hghg',
//           },
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   const wantObject = {
//     formPages: [
//       {
//         formQuestions: [
//           {
//             actionType: 'DELETE',
//             formPageId: 142,
//             isMandatory: false,
//             isActive: true,
//             isAllowComment: false,
//             isMultiAnswer: false,
//             isIncludeTime: false,
//             isImage: false,
//             labelFrom: '',
//             labelTo: '',
//             questionType: {
//               id: 1,
//               name: ' Multiple Choice',
//             },
//             answers: [
//               {
//                 description: '121',
//               },
//             ],
//             description: 'hghg',
//           },
//         ],
//         name: 'Page 1',
//         id: 1,
//       },
//     ],
//     formName: 'General',
//     id: 1,
//   };
//
//   expect(convertSubmitDataFromFormEditor(formObject, originalObject)).toBe(wantObject);
// });
