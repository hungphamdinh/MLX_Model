import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import MyReport from '../MyReport';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import MyReportItem from '@Components/InnovatorInspection/MyReportItem';
import { renderScreen } from '../../../../__mock__/mockApp';
import { TouchableOpacity, Text } from 'react-native';

jest.mock('@Context/Inspection/Hooks/UseInspection');
jest.mock('@Components/InnovatorInspection/MyReportItem', () => jest.fn(() => null));

const mockGetMyReports = jest.fn();
const mockViewMyReport = jest.fn();

const myReports = {
  data: [
    {
      id: '1',
      fileName: 'Report1.pdf',
      creationTime: '2022-01-01T10:00:00.000Z',
      completionDate: '2022-01-02T10:00:00.000Z',
      file: { uri: 'path/to/file1' },
    },
    {
      id: '2',
      fileName: 'Report2.pdf',
      creationTime: '2022-02-01T10:00:00.000Z',
      completionDate: '2022-02-02T10:00:00.000Z',
      file: { uri: 'path/to/file2' },
    },
  ],
  isLoadMore: false,
  isRefresh: false,
  currentPage: 1,
  totalPage: 1,
};

beforeEach(() => {
  useInspection.mockReturnValue({
    getMyReports: mockGetMyReports,
    viewMyReport: mockViewMyReport,
    inspection: { myReports },
  });
  mockGetMyReports.mockClear();
  mockViewMyReport.mockClear();
});

const render = () => renderScreen(<MyReport />)();

describe('MyReport', () => {
  it('renders correctly', () => {
    render();
  });

  it('calls getMyReports on search', async () => {
    const { getByPlaceholderText } = render();
    const searchInput = getByPlaceholderText('MY_REPORT_SEARCH');
    fireEvent.changeText(searchInput, 'test');

    await waitFor(() => {
      expect(mockGetMyReports).toHaveBeenCalledWith({ page: 1, keyword: 'test' });
    });
  });

  it('calls viewMyReport when an item is pressed', () => {
    MyReportItem.mockImplementation(({ item, onItemPress }) => (
      <TouchableOpacity onPress={() => onItemPress(item)} testID={`report-item-${item.id}`}>
        <Text>{item.fileName}</Text>
      </TouchableOpacity>
    ));

    const { getByTestId } = render();
    fireEvent.press(getByTestId('report-item-1'));
    expect(mockViewMyReport).toHaveBeenCalledWith(myReports.data[0]);
  });
});
