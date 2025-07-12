import { validateFields } from './changeDectorConst';
import { getDefaultDeltaChanges, getDeltaChanges } from './changeDetector';
import {
  form,
  formPage,
  formUserAnswerQuestionOption,
  formQuestion,
  formUserAnswerQuestionImage,
} from './mockTestData';
import { formItemTypes } from '../../Config/Constants';

const generateFormTemplate = (question) => ({
  ...form,
  formPages: [
    {
      ...formPage,
      formQuestions: [question],
    },
  ],
});

const formQuestionTypeMultipleChoice = {
  id: formItemTypes.MULTIPLE_CHOICE,
  name: 'Multiple choice',
};

const formQuestionTypeDropdown = {
  id: formItemTypes.DROPDOWN,
  name: 'Multiple choice',
};

describe('getDeltaChanges - CRUD form user answer question', () => {
  const uaqFields = validateFields.formUserAnswerQuestion;

  uaqFields.forEach((field) => {
    const testName = `should update the delta when ${field} changes`;

    it(testName, () => {
      const edittedFormQuestion = {
        ...formQuestion,
        [field]: 'test',
      };
      const fromObject = generateFormTemplate({
        ...formQuestion,
        [field]: null,
      });

      const toObject = generateFormTemplate(edittedFormQuestion);
      const expected = getDefaultDeltaChanges();
      expected.formUserAnswerQuestion.updated.push(edittedFormQuestion);

      const delta = getDeltaChanges(fromObject, toObject);

      expect(delta).toEqual(expected);
    });
  });
});

describe('getDeltaChanges - CRUD form dropdown', () => {
  it('should return the correct delta when dropdown value is added', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeDropdown,
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeDropdown,
      uaqDropdownValue: formUserAnswerQuestionOption,
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.created.push(formUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when dropdown value is updated', () => {
    const updatedFormUserAnswerQuestionOption = {
      ...formUserAnswerQuestionOption,
      value: 'Updated Value',
    };

    const fromObject = generateFormTemplate({
      ...formQuestion,
      uaqDropdownValue: formUserAnswerQuestionOption,
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      uaqDropdownValue: updatedFormUserAnswerQuestionOption,
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.updated.push(updatedFormUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when dropdown value is deleted', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,
      uaqDropdownValue: formUserAnswerQuestionOption,
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.deleted.push(formUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - CRUD form user answer question option', () => {
  it('should return the correct delta when a form user answer question option is added', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,

      uaqOptions: [],
      questionType: formQuestionTypeMultipleChoice,
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      uaqOptions: [formUserAnswerQuestionOption],
      questionType: formQuestionTypeMultipleChoice,
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.created.push(formUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form user answer question option is updated', () => {
    const updatedFormUserAnswerQuestionOption = {
      ...formUserAnswerQuestionOption,
      label: 'Updated Label',
    };
    const fromObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeMultipleChoice,
      uaqOptions: [formUserAnswerQuestionOption],
      formQuestionType: formQuestionTypeMultipleChoice,
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeMultipleChoice,
      uaqOptions: [updatedFormUserAnswerQuestionOption],
      formQuestionType: formQuestionTypeMultipleChoice,
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.updated.push(updatedFormUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form user answer question option is deleted', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeMultipleChoice,
      uaqOptions: [formUserAnswerQuestionOption],
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      questionType: formQuestionTypeMultipleChoice,
      uaqOptions: [],
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionOption.deleted.push(formUserAnswerQuestionOption);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - CRUD form user answer question images', () => {
  it('should return the correct delta when a form user answer question images is added', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [],
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [formUserAnswerQuestionImage],
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionImage.created.push(formUserAnswerQuestionImage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form user answer question images is updated', () => {
    const updatedFormUserAnswerQuestionImage = {
      ...formUserAnswerQuestionImage,
      position: 2,
    };
    const fromObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [formUserAnswerQuestionImage],
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [updatedFormUserAnswerQuestionImage],
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionImage.updated.push(updatedFormUserAnswerQuestionImage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form user answer question images is deleted', () => {
    const fromObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [formUserAnswerQuestionImage],
    });

    const toObject = generateFormTemplate({
      ...formQuestion,
      uaqImages: [],
    });

    const expected = getDefaultDeltaChanges();
    expected.formUserAnswerQuestionImage.deleted.push(formUserAnswerQuestionImage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});
