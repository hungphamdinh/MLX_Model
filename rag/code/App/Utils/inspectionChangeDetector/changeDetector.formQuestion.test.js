import _ from 'lodash';
import { getDefaultDeltaChanges, getDeltaChanges } from './changeDetector';
import { form, formPage, formQuestion, formQuestionAnswer, formUserAnswer } from './mockTestData';

const formQuestionAnswer2 = _.cloneDeep(formQuestionAnswer);
formQuestionAnswer2.id = 2;

describe('getDeltaChanges - CRUD form question', () => {
  it('should return an empty delta when the objects are the same', () => {
    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is added', () => {
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
          formQuestions: [formQuestion],
        },
      ],
    };
    const expected = getDefaultDeltaChanges();
    expected.formQuestion.created.push(formQuestion);
    expected.formUserAnswerQuestion.created.push(formQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is updated', () => {
    const updatedFormQuestion = {
      ...formQuestion,
      description: 'Updated Question Text',
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.updated.push(updatedFormQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is deleted', () => {
    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.deleted.push(formQuestion);
    expected.formUserAnswerQuestion.deleted.push(formQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - delete form question', () => {
  it('should return the correct delta when a form question is deleted', () => {
    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.deleted.push(formQuestion);
    expected.formUserAnswerQuestion.deleted.push(formQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is added', () => {
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
          formQuestions: [formQuestion],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestion.created.push(formQuestion);
    expected.formUserAnswerQuestion.created.push(formQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is updated', () => {
    const updatedFormQuestion = {
      ...formQuestion,
      description: 'Updated Label',
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.updated.push(updatedFormQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question option is added', () => {
    const formQuestionWithOption = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.created.push(formQuestionAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question option is updated', () => {
    const formQuestionAnswerUpdated = {
      ...formQuestionAnswer,
      label: 'Bad',
    };
    const formQuestionWithOption = {
      ...formQuestion,
      answers: [formQuestionAnswer],
    };

    const formQuestionWithOptionUpdated = {
      ...formQuestion,
      answers: [formQuestionAnswerUpdated],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOptionUpdated],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.updated.push(formQuestionAnswerUpdated);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question option is deleted', () => {
    const formQuestionWithOption = {
      ...formQuestion,
      answers: [formUserAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.deleted.push(formUserAnswer);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - update form question', () => {
  it('should return the correct delta when a form question is updated with a new label', () => {
    const updatedFormQuestion = {
      ...formQuestion,
      description: 'Updated Label',
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.updated.push(updatedFormQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is updated with a new questionType', () => {
    const updatedFormQuestion = {
      ...formQuestion,
      questionType: {
        id: 7,
        isActive: true,
        name: 'Rating',
        remoteId: 7,
      },
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.updated.push(updatedFormQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question is updated with a new required flag', () => {
    const updatedFormQuestion = {
      ...formQuestion,
      isMandatory: true,
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestion],
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
    expected.formQuestion.updated.push(updatedFormQuestion);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - add form question option', () => {
  it('should return the correct delta when a form question option is added to a multiple choice question', () => {
    const formQuestionWithOption = {
      ...formQuestion,
      type: 'multipleChoice',
      answers: [formQuestionAnswer],
    };

    const formQuestionWithOptionAdded = {
      ...formQuestion,
      type: 'multipleChoice',
      answers: [formQuestionAnswer, formQuestionAnswer2],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOptionAdded],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.created.push(formQuestionAnswer2);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});

describe('getDeltaChanges - delete form question option', () => {
  it('should return the correct delta when a form question option is deleted from a multiple choice question', () => {
    const formQuestionWithOption = {
      ...formQuestion,
      type: 'multipleChoice',
      answers: [formQuestionAnswer, formQuestionAnswer2],
    };

    const formQuestionWithOptionDeleted = {
      ...formQuestion,
      type: 'multipleChoice',
      answers: [formQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOptionDeleted],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.deleted.push(formQuestionAnswer2);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });

  it('should return the correct delta when a form question option is deleted from a dropdown question', () => {
    const formQuestionWithOption = {
      ...formQuestion,
      type: 'dropdown',
      answers: [formQuestionAnswer, formQuestionAnswer2],
    };

    const formQuestionWithOptionDeleted = {
      ...formQuestion,
      type: 'dropdown',
      answers: [formQuestionAnswer],
    };

    const fromObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOption],
        },
      ],
    };

    const toObject = {
      ...form,
      formPages: [
        {
          ...formPage,
          formQuestions: [formQuestionWithOptionDeleted],
        },
      ],
    };

    const expected = getDefaultDeltaChanges();
    expected.formQuestionAnswer.deleted.push(formQuestionAnswer2);

    const delta = getDeltaChanges(fromObject, toObject);

    expect(delta).toEqual(expected);
  });
});
