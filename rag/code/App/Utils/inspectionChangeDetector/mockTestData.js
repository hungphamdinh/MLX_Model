const form = {};

const formPage = {
  formId: '167',
  uid: 'ff726c33-11ba-48ff-9b06-fb07e9f09151',
  pageIndex: 0,
  remoteId: 463,
  id: 'e4831276-d091-41e0-ae7c-0edfaac15ead',
  formQuestionTypeCategoryId: 0,
  formGuid: 'c84593de-c2ee-4b79-8c91-c5a48a2ca802',
  guid: 'e4831276-d091-41e0-ae7c-0edfaac15ead',
  name: 'Page 1',
  isActive: true,
};

const formQuestion = {
  isScore: false,
  labelTo: '',
  uid: '67e3b695-79d8-4a37-b8f2-76a42d25984d',
  isAllowComment: false,
  id: '1dcd84bf-1f22-475a-8083-905375b404f6',
  questionType: {
    id: 8,
    isActive: true,
    name: 'Option',
    remoteId: 8,
  },
  uaqAnswerTexts: ['', '', '', '', ''],
  uaqAnswerContent: '',
  groupCode: 'QuestionGNP',
  description: 'Giảng viên có kiến thức về học phần\nđảm trách ',
  isIncludeTime: false,
  remoteId: 3670,
  uaqOptions: [],
  uaqComment: '',
  uaqImages: [],
  isRequiredImage: false,
  questionIndex: 0,
  labelFrom: '',
  isMultiAnswer: false,
  uaqUid: '5abe7e2a-ac74-43b0-9e56-296b767a4b26',
  formPageGuid: '9773803d-9548-48f5-ae64-a2a2a2d3f28a',
  uaqAnswerVisualDefects: '',
  isMandatory: false,
  guid: '1dcd84bf-1f22-475a-8083-905375b404f6',
  isImage: false,
  isActive: true,
  formPageId: '595',
  isRequiredLocation: false,
  formQuestionTypeId: '8',
};

const formUserAnswer = {};

const formQuestionAnswer = {
  id: '67470a91-7814-4cab-b0fa-191fdbc8e3c9',
  label: 'Good',
  uid: 'e7e7bd63-804d-4f00-9317-bda167cb923c',
  value: '67470a91-7814-4cab-b0fa-191fdbc8e3c9',
  formQuestionAnswerTemplateId: 3,
};

const formUserAnswerQuestion = {
  uaqAnswerTexts: ['', '', '', '', ''],
  uaqAnswerContent: '',
  uaqDropdownValue: {
    id: '04916b3d-6a24-4717-9b2f-84aff9162a50',
    label: 'Poor',
    uid: '4874a0cc-9fdb-4d86-a9ea-9710b84e48b8',
    value: '04916b3d-6a24-4717-9b2f-84aff9162a50',
    formQuestionAnswerTemplateId: 5,
  },
  uaqOptions: [],
  uaqComment: '',
  uaqImages: [],
  uaqUid: '8de0e3f9-d974-4e9a-9501-cbb3a0e06caf',
  uaqAnswerVisualDefects: '',
};

const formUserAnswerQuestionOption = {
  id: '04916b3d-6a24-4717-9b2f-84aff9162a50',
  label: 'Poor',
  uid: '4874a0cc-9fdb-4d86-a9ea-9710b84e48b8',
  value: '04916b3d-6a24-4717-9b2f-84aff9162a50',
  formQuestionAnswerTemplateId: 5,
};

const formUserAnswerQuestionImage = {
  location: {
    altitude: 0,
    altitudeAccuracy: -1,
    latitude: 37.785834,
    accuracy: 5,
    longitude: -122.406417,
    heading: -1,
    speed: -1,
  },
  uid: '4c4e5306-20cb-42bb-94e1-e9cf85585d0f',
  workflowGuid: 'db9f2a9b-19b2-4514-8a7b-3841e2d70bb4',
  position: 0,
  path:
    'file:///Users/thien/Library/Developer/CoreSimulator/Devices/DF0BF3CC-D877-4147-BA41-9F0ACD72D6CC/data/Containers/Data/Application/0C2450E3-B717-4674-AD2E-6ECA124A6D6B/Documents/images/ea6ae08c-e56e-4afa-9414-17f3d049124c.jpg',
  longitude: -122.406417,
  files: {
    position: 0,
  },
  latitude: 37.785834,
};

module.exports = {
  form,
  formPage,
  formQuestion,
  formUserAnswer,
  formQuestionAnswer,
  formUserAnswerQuestion,
  formUserAnswerQuestionOption,
  formUserAnswerQuestionImage,
};
