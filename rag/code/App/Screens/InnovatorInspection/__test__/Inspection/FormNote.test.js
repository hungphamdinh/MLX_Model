// FormNote.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import NavigationServices from '@NavigationService';
import FormNote from '../../Inspection/FormNote'; // Adjust the import path as needed
import { useCompatibleForm } from '@Utils/hook';
import { useForm } from 'react-hook-form';


jest.mock('@Utils/hook', () => ({
  useCompatibleForm: jest.fn(),
}));

jest.mock('@Components/Forms', () => {
  const {
    FormInputMock,
  } = require('@Mock/components/Forms');

  return {
    FormInput: ({ name, label, testID }) => <FormInputMock name={name} label={label} testID={testID} />,
  };
});

describe('FormNote Component', () => {
  let mockCallBack;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallBack = jest.fn();

    useCompatibleForm.mockImplementation(({ defaultValues }) => {
      const methods = useForm({ defaultValues });
      return { ...methods };
    });
  });

  const renderFormNote = ({
    routeName = 'formNote',
    isView = false,
    notes = 'Test note',
    dynamicNotes = [],
    placeholder = 'Placeholder text',
  } = {}) => {
    global.useMockRoute = {
      name: routeName,
      params: {
        callBack: mockCallBack,
        isView,
        notes,
        dynamicNotes,
        placeholder,
      },
    };

    return render(<FormNote />);
  };

  it('submits only "notes" when routeName != "formNotes"', async () => {
    const notes = 'My test note';
    renderFormNote({
      routeName: 'formNote',
      isView: false,
      notes,
      dynamicNotes: [],
      placeholder: 'Type here...',
    });


    const saveButton = screen.getByTestId('baselayout-right-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockCallBack).toHaveBeenCalledTimes(1);
      expect(mockCallBack).toHaveBeenCalledWith('My test note');
      expect(NavigationServices.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it('submits entire form values (comments + notes) when routeName = "formNotes"', async () => {
    const dynamicNotes = [
      { id: 1, titleComment: 'Title #1', answerComment: 'Answer #1' },
      { id: 2, titleComment: 'Title #2', answerComment: 'Answer #2' },
    ];
    const notes = 'General notes here';

    renderFormNote({
      routeName: 'formNotes',
      isView: false,
      notes,
      dynamicNotes,
      placeholder: 'Placeholder for notes',
      isSurveyModule: false
    });

    const saveButton = screen.getByTestId('baselayout-right-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockCallBack).toHaveBeenCalledTimes(1);
      expect(mockCallBack).toHaveBeenCalledWith({
        comments: [
          { id: 1, titleComment: 'Title #1', answerComment: 'Answer #1', formQuestionCommentId: 1 },
          { id: 2, titleComment: 'Title #2', answerComment: 'Answer #2', formQuestionCommentId: 2 },
        ],
        notes: 'General notes here',
      });
      expect(NavigationServices.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render the save button if isView = true', () => {
    renderFormNote({
      routeName: 'formNote',
      isView: true,
      notes: 'Read only note',
      dynamicNotes: [],
    });

    expect(screen.queryByTestId('baselayout-right-button')).toBeNull();
  });

  it('renders dynamic notes fields if provided, even if routeName != "formNotes"', () => {
    renderFormNote({
      routeName: 'formNote', // not 'formNotes'
      isView: false,
      notes: '',
      dynamicNotes: [
        { id: 123, titleComment: 'Title #123', answerComment: 'Answer #123' },
      ],
    });

    expect(screen.getByText('Title #123')).toBeTruthy();
    expect(screen.getByTestId('comment-0-input')).toBeTruthy();
  });

  it('handles input changes correctly', async () => {
    const dynamicNotes = [
      { id: 1, titleComment: 'Dynamic Title #1', answerComment: '' },
      { id: 2, titleComment: 'Dynamic Title #2', answerComment: '' },
    ];
    const initialNotes = 'Initial notes';
    const updatedNotes = 'Updated notes';

    renderFormNote({
      routeName: 'formNotes',
      isView: false,
      notes: initialNotes,
      dynamicNotes,
      placeholder: 'Enter your notes here...',
    });

    const notesInput = screen.getByTestId('notes-input');
    fireEvent.changeText(notesInput, updatedNotes);

    const comment1Input = screen.getByTestId('comment-0-input');
    const comment2Input = screen.getByTestId('comment-1-input');

    fireEvent.changeText(comment1Input, 'Answer for dynamic comment 1');
    fireEvent.changeText(comment2Input, 'Answer for dynamic comment 2');

    const saveButton = screen.getByTestId('baselayout-right-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockCallBack).toHaveBeenCalledTimes(1);
      expect(mockCallBack).toHaveBeenCalledWith({
        comments: [
          {
            id: 1,
            titleComment: 'Dynamic Title #1',
            answerComment: 'Answer for dynamic comment 1',
            formQuestionCommentId: 1,
          },
          {
            id: 2,
            titleComment: 'Dynamic Title #2',
            answerComment: 'Answer for dynamic comment 2',
            formQuestionCommentId: 2,
          },
        ],
        notes: 'Updated notes',
      });
      expect(NavigationServices.goBack).toHaveBeenCalledTimes(1);
    });
  });
});