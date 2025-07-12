import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DynamicComments from '../../AddOrEditItemModal/DynamicComments';
import { FormProviderWrapper } from '@Mock/mockApp'

const defaultValues = {
  guid: 'some-guid',
  id: 'some-question-id',
}

const renderComponent = (values) => render(
  <FormProviderWrapper defaultValues={{...defaultValues, ...values}}>
    <DynamicComments />
  </FormProviderWrapper>
)

describe('DynamicComments Component', () => {
  it('should render initial fields correctly', () => {
    const values = {
      comments: [
        { titleComment: 'Comment 1', guid: 'some-guid', formQuestionId: 'some-question-id' },
      ],
    };

    const { getByText, queryAllByPlaceholderText } = renderComponent(values);
    expect(getByText(/1. COMMENT/i)).toBeTruthy();
    expect(queryAllByPlaceholderText('DYNAMIC_COMMENT_PLACE_HOLDER')).toHaveLength(1);
    expect(getByText('ADD_COMMENT')).toBeTruthy();
  });

  it('should add a new comment field when clicking "ADD_COMMENT" and not exceed 5 fields', () => {
    const values = {
      comments: [
        { titleComment: 'Comment 1', guid: 'some-guid', formQuestionId: 'some-question-id' },
        { titleComment: 'Comment 2', guid: 'some-guid', formQuestionId: 'some-question-id' },
        { titleComment: 'Comment 3', guid: 'some-guid', formQuestionId: 'some-question-id' },
        { titleComment: 'Comment 4', guid: 'some-guid', formQuestionId: 'some-question-id' },
      ],
    };

    const { getByText, queryAllByPlaceholderText, queryByText } = renderComponent(values);

    expect(queryAllByPlaceholderText('DYNAMIC_COMMENT_PLACE_HOLDER')).toHaveLength(4);

    fireEvent.press(getByText('ADD_COMMENT'));
    expect(queryAllByPlaceholderText('DYNAMIC_COMMENT_PLACE_HOLDER')).toHaveLength(5);

    expect(queryByText('ADD_COMMENT')).toBeFalsy();
  });

  it('should remove a comment field when clicking the close icon', () => {
    const values = {
      comments: [
        { titleComment: 'Comment 1', guid: 'some-guid', formQuestionId: 'some-question-id' },
        { titleComment: 'Comment 2', guid: 'some-guid', formQuestionId: 'some-question-id' },
      ],
    };

    const { getAllByTestId, queryAllByPlaceholderText } = renderComponent(values);

    expect(queryAllByPlaceholderText('DYNAMIC_COMMENT_PLACE_HOLDER')).toHaveLength(2);

    const removeButtons = getAllByTestId('button-remove');
    fireEvent.press(removeButtons[1]); // remove the second comment's button

    expect(queryAllByPlaceholderText('DYNAMIC_COMMENT_PLACE_HOLDER')).toHaveLength(1);

  });
});