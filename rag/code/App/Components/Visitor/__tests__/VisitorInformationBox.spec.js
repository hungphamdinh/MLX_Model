import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, fireEvent, screen } from '@testing-library/react-native';
import VisitorInformationBox from '../VisitorInformationBox'; // replace with your actual component's import

const VisitorInfoBox = () => {
  const formMethods = useForm({
    defaultValues: {
      visitorInformations: [{}],
    },
  });

  return (
    <FormProvider {...formMethods}>
      <VisitorInformationBox formMethods={formMethods} />
    </FormProvider>
  );
};
describe('VisitorInformationBox', () => {
  const renderVisitorBox = () => render(<VisitorInfoBox />);

  it('should render correctly', () => {
    const { getByTestId, getByText } = renderVisitorBox();
    screen.debug({
      mapProps: (props) => ({
        testID: props.testID,
      }),
    });
    // Check if the add visitor button is rendered
    expect(getByTestId('add-visitor-button')).toBeTruthy();

    // Check if the title is rendered
    expect(getByText('VS_INFORMATION')).toBeTruthy();
  });

  it('should handle user input correctly', () => {
    const { getByTestId } = renderVisitorBox();

    // Simulate user input
    const nameInput = getByTestId('visitor-name');
    fireEvent.changeText(nameInput, 'John Doe');

    const phoneInput = getByTestId('visitor-phone');
    fireEvent.changeText(phoneInput, '1234567890');

    const idInput = getByTestId('visitor-id');
    fireEvent.changeText(idInput, '1234');

    // test if the input is handled correctly
    expect(nameInput.props.value).toBe('John Doe');
    expect(phoneInput.props.value).toBe('1234567890');
    expect(idInput.props.value).toBe('1234');
  });

  it('should handle add visitor button press', () => {
    const { getByTestId } = renderVisitorBox();

    // Simulate user pressing the add visitor button
    const addButton = getByTestId('add-visitor-button');
    fireEvent.press(addButton);

    // check length of visitorInformations array
    const visitorInformations = screen.getAllByTestId('visitor-information');
    expect(visitorInformations.length).toBe(2);
  });
});
