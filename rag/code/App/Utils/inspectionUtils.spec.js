import { calculateEstimatedSizeForForm, getFormStructureJson } from './inspectionUtils';

describe('calculateEstimatedSizeForForm', () => {
  test('calculates estimated size for a form', () => {
    const form = {
      formPages: [
        {
          formQuestions: [
            { id: 1, question: 'What is your name?' },
            { id: 2, question: 'What is your email?' },
          ],
        },
        {
          formQuestions: [
            { id: 3, question: 'What is your age?' },
            { id: 4, question: 'What is your gender?' },
            { id: 5, question: 'What is your occupation?' },
          ],
        },
      ],
    };
    const result = calculateEstimatedSizeForForm(form);
    expect(result.estimateSectionSize).toBe(450);
    expect(result.estimateQuestionSize).toBe(165);
  });

  test('returns default values when form is empty', () => {
    const form = {};
    const result = calculateEstimatedSizeForForm(form);
    expect(result.estimateSectionSize).toBe(120);
    expect(result.estimateQuestionSize).toBe(165);
  });

  test('returns default values when formPages is empty', () => {
    const form = { formPages: [] };
    const result = calculateEstimatedSizeForForm(form);
    expect(result.estimateSectionSize).toBe(120);
    expect(result.estimateQuestionSize).toBe(165);
  });

  test('returns correct estimate when there is only one formPage with questions', () => {
    const form = {
      formPages: [
        {
          formQuestions: [
            { id: 1, question: 'What is your name?' },
            { id: 2, question: 'What is your email?' },
          ],
        },
      ],
    };
    const result = calculateEstimatedSizeForForm(form);
    expect(result.estimateSectionSize).toBe(450);
    expect(result.estimateQuestionSize).toBe(165);
  });
  test('returns correct estimate when formQuestions have different lengths', () => {
    const form = {
      formPages: [
        {
          formQuestions: [
            { id: 1, question: 'What is your name?' },
            { id: 2, question: 'What is your email?' },
          ],
        },
        {
          formQuestions: [{ id: 3, question: 'What is your age?' }],
        },
      ],
    };
    const result = calculateEstimatedSizeForForm(form);
    expect(result.estimateSectionSize).toBe(285);
    expect(result.estimateQuestionSize).toBe(165);
  });
});

describe('getFormStructureJson', () => {
  const form = {
    formPages: [
      {
        id: 1,
        formQuestions: [
          {
            id: 1,
            question: 'Question 1',
          },
          {
            id: 2,
            question: 'Question 2',
          },
        ],
      },
      {
        id: 2,
        formQuestions: [
          {
            id: 3,
            question: 'Question 3',
          },
        ],
      },
      {
        id: 3,
        formQuestions: null,
      },
    ],
  };

  it('should return an object with form page ids as keys and an array of form question ids as values', () => {
    const result = getFormStructureJson(form);
    expect(result).toEqual({
      1: [1, 2],
      2: [3],
      3: [],
    });
  });

  it('should return an empty object if form has no form pages', () => {
    const result = getFormStructureJson({ formPages: [] });
    expect(result).toEqual({});
  });

  it('should return an empty object if form has no form pages is null', () => {
    const result = getFormStructureJson({ formName: 'Form 1' });
    expect(result).toEqual({});
  });
});
