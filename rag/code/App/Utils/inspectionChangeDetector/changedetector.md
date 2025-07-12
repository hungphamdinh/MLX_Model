```All data used by app
    Form,
    FormPage,
    FormQuestion,
    FormStatus,
    InspectionProperty,
    Inspection,
    Workflow,
    FormUserAnswer,
    FormUserAnswerQuestion,
    FormQuestionAnswer,
    FormUserAnswerQuestionImage,
    FormUserAnswerQuestionOption,
    SignatureImage,
```

From object

```js
const formObject = {
  formPages: [
    {
      formQuestions: [
        {
          formPageId: 142,
          isMandatory: false,
          isActive: true,
          isAllowComment: false,
          isMultiAnswer: false,
          isIncludeTime: false,
          isImage: false,
          labelFrom: '',
          labelTo: '',
          questionType: {
            id: 1,
            name: ' Multiple Choice',
          },
          answers: [
            {
              description: '121',
            },
          ],
          description: 'hghg',
        },
      ],
      name: 'Page 1',
      id: 1,
    },
  ],
  formName: 'General',
  id: 1,
};
```

To object

```js
const toObject = {
  formPages: [
    {
      formQuestions: [
        {
          formPageId: 142,
          isMandatory: false,
          isActive: true,
          isAllowComment: false,
          isMultiAnswer: false,
          isIncludeTime: false,
          isImage: false,
          labelFrom: '',
          labelTo: '',
          questionType: {
            id: 1,
            name: ' Multiple Choice',
          },
          answers: [
            {
              description: '121',
            },
          ],
          description: 'hghg',
        },
      ],
      name: 'Page 1',
      id: 1,
    },
  ],
  formName: 'General2',
  id: 1,
};
```

Output

```js
const result = [
  {
    formPage: {
      created: [],
      updated: [
        {
          id: 1,
          name: 'Page 1',
        },
      ],
      deleted: [],
    },
  },
];
```

    expected to when detect

    {
        formPage: {
            created: [],
            updated: [],
            deleted: [],
        },
          formQuestion: {
            created: [],
            updated: [],
            deleted: [],
        },
          formStatus: {
            created: [],
            updated: [],
            deleted: [],
        },
          formUserAnswer: {
            created: [],
            updated: [],
            deleted: [],
        },
          formUserAnswerQuestion: {
            created: [],
            updated: [],
            deleted: [],
        },
         formUserAnswerQuestionOption: {
            created: [],
            updated: [],
            deleted: [],
        },

    }

Flow chart

Overview chart

```mermaid
  graph TD
  1[Form Editor] --> A[User Make Changes]
  A --> B[Save Function Debounce 300ms]
  B --> C{Change Detector}
  C -->|No Changes| D[Do nothing]
  C -->|Have Changes|E{Update form data to local storage}
  E -->|Fail| F[Show error message]
  E -->|Success|G[Update lastdata object to form Editor]
  G -->1
```

Detail chart

```mermaid
graph TD
A[Check Level Delta Change] --> B{Is levelIndex undefined?}
B -->|Yes| C[Return result]
B -->|No| D[Call Check Level Delta Change with next levelIndex]
D --> E{Is there a level 1 delete?}
E -->|Yes| F[Append child levels to delete object]
F --> G{Is there a level 2 delete?}
G -->|Yes| H[Append child levels to delete object]
H --> I{Is there a level 3 delete?}
I -->|Yes| J[Append child levels to delete object]
D --> K{Is there a level 1 create?}
K -->|Yes| L[Append child levels to create object]
L --> M{Is there a level 2 create?}
M -->|Yes| N[Append child levels to create object]
N --> O{Is there a level 3 create?}
O -->|Yes| P[Append child levels to create object]
D --> Q{Is there a level 1 update?}
Q -->|Yes| R[Append child levels to update object]
R --> S{Is there a level 2 update?}
S -->|Yes| T[Append child levels to update object]
T --> U{Is there a level 3 update?}
U -->|Yes| V[Append child levels to update object]
V --> W{Are there any level 2 changes?}
W -->|Yes| X[Call Check Level Delta Change with levelIndex 2]
X --> Y{Are there any level 3 changes?}
Y -->|Yes| Z[Call Check Level Delta Change with levelIndex 3]
W -->|No| Y
R --> AA{Are there any level 2 changes?}
AA -->|Yes| AB[Call Check Level Delta Change with levelIndex 2]
AB --> AC{Are there any level 3 changes?}
AC -->|Yes| AD[Call Check Level Delta Change with levelIndex 3]
AB -->|No| AC
L --> AE{Are there any level 2 changes?}
AE -->|Yes| AF[Call Check Level Delta Change with levelIndex 2]
AF --> AG{Are there any level 3 changes?}
AG -->|Yes| AH[Call Check Level Delta Change with levelIndex 3]
AF -->|No| AG

```

```mermaid
graph TD
    A[Start] --> B[Delete form page]
    B --> C[Check delta changes]
    C --> D[End]
    A --> E[Add form page with question and answer]
    E --> F[Check delta changes]
    F --> D[End]
    A --> G[Add form question with answer]
    G --> H[Check delta changes]
    H --> D[End]
```
