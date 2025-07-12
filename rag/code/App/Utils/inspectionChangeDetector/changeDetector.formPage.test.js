import { getDefaultDeltaChanges, getDeltaChanges } from './changeDetector';
import { form, formPage, formQuestionAnswer, formQuestion } from './mockTestData';

describe('getDeltaChanges - CRUD form page', () => {
  it('should return an empty delta when the objects are the same', () => {
    const fromObject = {
      ...form,
      formPages: [formPage],
    };

    const toObject = {
      ...form,
      formPages: [formPage],
    };

    const expected = getDefaultDeltaChanges();

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page is added', () => {
    const fromObject = {
      ...form,
      formPages: [],
    };

    const toObject = {
      ...form,
      formPages: [formPage],
    };

    const expected = getDefaultDeltaChanges();
    expected.formPage.created.push(formPage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page is updated', () => {
    const updatedFormPage = {
      ...formPage,
      name: 'Updated Page Name',
    };

    const fromObject = {
      ...form,
      formPages: [formPage],
    };

    const toObject = {
      ...form,
      formPages: [updatedFormPage],
    };
    const expected = getDefaultDeltaChanges();
    expected.formPage.updated.push(updatedFormPage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page is deleted', () => {
    const fromObject = {
      ...form,
      formPages: [formPage],
    };

    const toObject = {
      ...form,
      formPages: [],
    };

    const expected = getDefaultDeltaChanges();
    expected.formPage.deleted.push(formPage);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - form page with form question and form question answer', () => {
  it('should return the correct delta when a form question with answer is added to a form page', () => {
    const formQuestionWithAnswer = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithAnswer],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestion.created.push(formQuestionWithAnswer);
    expected.formQuestionAnswer.created.push(formQuestionAnswer);
    expected.formUserAnswerQuestion.created.push(formQuestionWithAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question with answer is updated', () => {
    const updatedFormQuestionAnswer = {
      ...formQuestionAnswer,
      label: 'Updated Label',
    };

    const updatedFormQuestion = {
      ...formQuestion,
      answers: [updatedFormQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [
            {
              ...formQuestion,
              answers: [formQuestionAnswer],
            },
          ],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [updatedFormQuestion],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.updated.push(updatedFormQuestionAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question with answer is deleted', () => {
    const formQuestionWithAnswer = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithAnswer],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestion.deleted.push(formQuestionWithAnswer);
    expected.formUserAnswerQuestion.deleted.push(formQuestionWithAnswer);
    expected.formQuestionAnswer.deleted.push(formQuestionAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page with question and answer is added', () => {
    const formQuestionWithAnswer = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const formPageWithQuestion = {
      ...formPage,
      formQuestions: [formQuestionWithAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [],
    };

    const toObject = {
      ...form,
      formPages: [formPageWithQuestion],
    };

    const expected = getDefaultDeltaChanges();
    expected.formPage.created.push(formPageWithQuestion);
    expected.formQuestion.created.push(formQuestionWithAnswer);
    expected.formQuestionAnswer.created.push(formQuestionAnswer);
    expected.formUserAnswerQuestion.created.push(formQuestionWithAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page with question and answer is updated', () => {
    const updatedFormQuestionAnswer = {
      ...formQuestionAnswer,
      label: 'Updated Label',
    };

    const updatedFormQuestion = {
      ...formQuestion,
      answers: [updatedFormQuestionAnswer],
    };

    const updatedFormPage = {
      ...formPage,
      formQuestions: [updatedFormQuestion],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [
            {
              ...formQuestion,
              answers: [formQuestionAnswer],
            },
          ],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [updatedFormPage],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.updated.push(updatedFormQuestionAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form page with question and answer is deleted', () => {
    const formQuestionWithAnswer = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const formPageWithQuestion = {
      ...formPage,
      formQuestions: [formQuestionWithAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [formPageWithQuestion],
    };

    const toObject = {
      ...form,
      formPages: [],
    };

    const expected = getDefaultDeltaChanges();
    expected.formPage.deleted.push(formPageWithQuestion);
    expected.formQuestion.deleted.push(formQuestionWithAnswer);
    expected.formUserAnswerQuestion.deleted.push(formQuestionWithAnswer);
    expected.formQuestionAnswer.deleted.push(formQuestionAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});
