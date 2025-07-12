import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppList from '@Components/Lists/AppList';
import ItemMeterReadingHistory from '@Components/ItemApp/ItemMeterReadingHistory';
import useMeterReading from '@Context/MeterReading/Hooks/UseMeterReading';
import { icons } from '../../../../../Resources/icon';
import WhiteSegmentControl from '../../../../../Components/WhiteSegmentControl';

const Wrapper = styled.View`
  flex: 1;
`;
const MeterReadingHistoryTab = ({ id }) => {
  const [viewType, setViewType] = useState(0);
  const {
    meterReading: { histories, currentMonthReadings, settings },
    getMeterReadingHistories,
    getMeterReadingCurrentMonth,
  } = useMeterReading();

  useEffect(() => {
    getMeterReadingCurrentMonth(id);
    getMeterReadingHistories(id);
  }, []);

  // useEffect(() => {
  //   if (viewType === 1 && !histories.data.length) {
  //     getMeterReadingHistories(id);
  //   }
  // }, [viewType]);

  const listData = viewType ? histories : currentMonthReadings;

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = listData;

  const renderItem = (item) => <ItemMeterReadingHistory settings={settings} item={item} />;

  const loadData = () => {
    if (viewType) {
      return getMeterReadingHistories(id);
    }

    return getMeterReadingCurrentMonth(id);
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData,
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  const viewTypeProps = {
    values: ['METER_CURRENT_MONTH', 'METER_PREVIOUS_MONTHS'],
    selectedIndex: viewType,
    onChange: setViewType,
  };

  return (
    <Wrapper>
      <AppList {...listProps} />
      <WhiteSegmentControl {...viewTypeProps} />
    </Wrapper>
  );
};

export default MeterReadingHistoryTab;
