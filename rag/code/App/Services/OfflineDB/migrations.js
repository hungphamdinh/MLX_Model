import { schemaMigrations, addColumns, createTable } from '@nozbe/watermelondb/Schema/migrations';
import { isSIBundleID } from '../../Config';

const commonMigrations = (toVersion) => [
  {
    toVersion,
    steps: [
      addColumns({
        table: 'signatureImage',
        columns: [
          { name: 'fileName', type: 'string' },
          { name: 'fileUrl', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'referenceId', type: 'string' },
          { name: 'moduleName', type: 'string' },
        ],
      }),
    ],
  },
  {
    toVersion: toVersion + 1,
    steps: [
      createTable({
        name: 'formUserAnswerQuestionMarching',
        columns: [
          {
            name: 'guid',
            type: 'string',
          },
          {
            name: 'formUserAnswerQuestionGuid',
            type: 'string',
          },
          {
            name: 'formUserAnswerQuestionId',
            type: 'string',
          },
          {
            name: 'marching',
            type: 'string',
          },
          {
            name: 'isPhotographTaken',
            type: 'boolean',
            isOptional: true,
          },
          {
            name: 'texts',
            type: 'string',
          },
          {
            name: 'remoteId',
            type: 'number',
          },
          { name: 'created_at', type: 'number' },
          { name: 'updated_at', type: 'number' },
        ],
      }),
      addColumns({
        table: 'formPage',
        columns: [{ name: 'formQuestionTypeCategoryId', type: 'string' }],
      }),
    ],
  },
  {
    toVersion: toVersion + 2,
    steps: [
      addColumns({
        table: 'inspection',
        columns: [{ name: 'isRequiredSignature', type: 'boolean' }],
      }),
      addColumns({
        table: 'form',
        columns: [{ name: 'isReadOnly', type: 'boolean' }],
      }),
    ],
  },
];

const prevMigration = isSIBundleID
  ? [
      ...commonMigrations(2),
      {
        toVersion: 5,
        steps: [],
      },
      {
        toVersion: 6,
        steps: [],
      },
      {
        toVersion: 7,
        steps: [],
      },
      {
        toVersion: 8,
        steps: [],
      },
    ]
  : [
      {
        toVersion: 2,
        steps: [
          addColumns({
            table: 'formQuestion',
            columns: [{ name: 'isRequiredImage', type: 'boolean' }],
          }),
        ],
      },
      {
        toVersion: 3,
        steps: [
          addColumns({
            table: 'formQuestion',
            columns: [{ name: 'isScore', type: 'boolean' }],
          }),
        ],
      },
      {
        toVersion: 4,
        steps: [
          addColumns({
            table: 'inspectionProperty',
            columns: [
              { name: 'floor', type: 'string' },
              { name: 'building', type: 'string' },
              { name: 'district', type: 'string' },
              { name: 'city', type: 'string' },
            ],
          }),
        ],
      },
      {
        toVersion: 5,
        steps: [
          addColumns({
            table: 'formQuestion',
            columns: [{ name: 'isRequiredLocation', type: 'boolean' }],
          }),
          addColumns({
            table: 'inspection',
            columns: [
              { name: 'isRequiredLocation', type: 'boolean' },
              { name: 'longitude', type: 'number' },
              { name: 'latitude', type: 'number' },
              { name: 'team', type: 'string' },
              { name: 'lastModificationTime', type: 'string' },
            ],
          }),
          addColumns({
            table: 'formUserAnswerQuestionImage',
            columns: [
              { name: 'longitude', type: 'number' },
              { name: 'latitude', type: 'number' },
            ],
          }),
          addColumns({
            table: 'workflow',
            columns: [
              { name: 'rescheduleDate', type: 'string' },
              { name: 'rescheduleRemark', type: 'string' },
            ],
          }),
        ],
      },
      ...commonMigrations(6),
    ];

const migrations = schemaMigrations({
  migrations: [
    ...prevMigration,
    {
      toVersion: 9,
      steps: [],
    },
    {
      toVersion: 10,
      steps: [
        addColumns({
          table: 'formQuestion',
          columns: [
            { name: 'isDeclareQuantity', type: 'boolean' },
            { name: 'isDeclareQuantityMandatory', type: 'boolean' },
          ],
        }),
        addColumns({
          table: 'formUserAnswerQuestion',
          columns: [{ name: 'declareQuantity', type: 'string' }],
        }),
      ],
    },
    {
      toVersion: 11,
      steps: [
        createTable({
          name: 'formPageGroup',
          columns: [
            {
              name: 'guid',
              type: 'string',
            },
            {
              name: 'formGuid',
              type: 'string',
            },
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'formId',
              type: 'string',
            },
            {
              name: 'remoteID',
              type: 'number',
            },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        addColumns({
          table: 'formPage',
          columns: [
            { name: 'formPageGroupGuid', type: 'string' },
            { name: 'formPageGroupId', type: 'number' },
            { name: 'formPageGroupName', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 12,
      steps: [
        createTable({
          name: 'formSubQuestionAnswer',
          columns: [
            {
              name: 'guid',
              type: 'string',
            },
            {
              name: 'formSubQuestionGuid',
              type: 'string',
            },
            {
              name: 'formSubQuestionId',
              type: 'number',
            },
            {
              name: 'description',
              type: 'string',
            },
            {
              name: 'remoteId',
              type: 'number',
            },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'formSubQuestion',
          columns: [
            {
              name: 'guid',
              type: 'string',
            },
            {
              name: 'formQuestionGuid',
              type: 'string',
            },
            {
              name: 'formQuestionId',
              type: 'number',
            },
            {
              name: 'description',
              type: 'string',
            },
            {
              name: 'isMultiAnswer',
              type: 'boolean',
            },
            {
              name: 'formQuestionTypeId',
              type: 'number',
            },
            {
              name: 'isDescriptionDefined',
              type: 'boolean',
            },
            {
              name: 'remoteId',
              type: 'number',
            },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'formSubUserAnswerQuestion',
          columns: [
            {
              name: 'guid',
              type: 'string',
            },
            {
              name: 'formUserAnswerGuid',
              type: 'string',
            },
            {
              name: 'formUserAnswerId',
              type: 'string',
            },
            {
              name: 'questionId',
              type: 'string',
            },
            {
              name: 'questionGuid',
              type: 'string',
            },
            {
              name: 'answerContent',
              type: 'string',
            },
            {
              name: 'answerDate',
              type: 'string',
            },
            {
              name: 'answerNumeric',
              type: 'number',
            },
            {
              name: 'comment',
              type: 'string',
            },
            {
              name: 'remoteId',
              type: 'number',
            },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'formSubUserAnswerQuestionOption',
          columns: [
            {
              name: 'guid',
              type: 'string',
            },
            {
              name: 'formUserAnswerQuestionGuid',
              type: 'string',
            },
            {
              name: 'formUserAnswerQuestionId',
              type: 'string',
            },
            {
              name: 'formQuestionAnswerGuid',
              type: 'string',
            },
            {
              name: 'formQuestionAnswerId',
              type: 'string',
            },
            {
              name: 'remoteId',
              type: 'number',
            },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        addColumns({
          table: 'formQuestion',
          columns: [
            { name: 'projectTypeId', type: 'number' },
            { name: 'budgetCode', type: 'string' },
          ],
        }),
      ],
    },
    {
      toVersion: 13,
      steps: [
        addColumns({
          table: 'form',
          columns: [{ name: 'type', type: 'number' }],
        }),
      ],
    },
    {
      toVersion: 14,
      steps: [
        addColumns({
          table: 'formUserAnswerQuestion',
          columns: [
            { name: 'defectDescription', type: 'string' },
            { name: 'isDefect', type: 'boolean' },
          ],
        }),
        addColumns({
          table: 'inspection',
          columns: [{ name: 'teamAssignee', type: 'string' }],
        }),
      ],
    },
  ],
});

export default migrations;
