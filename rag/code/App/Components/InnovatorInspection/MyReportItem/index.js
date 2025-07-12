/**
 * Created by thienmd on 9/23/20
 */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Row from '../../Grid/Row';
import { Colors } from '../../../Themes';
import { StatusView, Text } from '../../../Elements';
import { HorizontalLine, ID, VerticalLabelValue, Wrapper } from '../../ItemApp/ItemCommon';
import styled from 'styled-components/native';
import { formatDate } from '../../../Utils/transformData';
import LocaleConfig from '../../../Config/LocaleConfig';
import { MY_REPORT_STATUS_ID } from '../../../Config/Constants';
const DateWrapper = styled(Row)`
  margin-vertical: 5px;
`;

const IDText = styled(ID)`
  margin-bottom: 10px;
`;

const MyReportItem = ({ item, onItemPress }) => {
  const { id, fileName, creationTime, completionDate, file, statusId } = item;
  const isCompleted = statusId === MY_REPORT_STATUS_ID.COMPLETED;

  const getStatus = () => {
    if (statusId === MY_REPORT_STATUS_ID.FAILED) {
      return {
        name: 'FAILED',
        color: Colors.red,
      };
    }
    if (isCompleted) {
      return {
        name: 'COMPLETED',
        color: Colors.success,
      };
    }
    return {
      name: 'IN_PROGRESS',
      color: Colors.statusHight,
    };
  };

  const statusName = getStatus().name;
  const color = getStatus().color;

  return (
    <Wrapper testID="report-item">
      <TouchableOpacity
        testID="report-item-button"
        disabled={!isCompleted}
        onPress={() => isCompleted && file && onItemPress(item)}
      >
        <IDText text={`#${id}`} preset="bold" />
        <HorizontalLine />
        <Text text={fileName} />
        <DateWrapper center>
          <VerticalLabelValue
            label="COMMON_START_DATE"
            value={formatDate(creationTime, LocaleConfig.fullDateTimeFormat)}
          />
          <VerticalLabelValue
            label="COMMON_END_DATE"
            value={formatDate(completionDate, LocaleConfig.fullDateTimeFormat)}
          />
        </DateWrapper>
        <StatusView
          subComponent={file && <Ionicons name="download-outline" size={20} color={Colors.azure} />}
          hideNextIcon
          status={{ colorCode: color, name: statusName }}
        />
      </TouchableOpacity>
    </Wrapper>
  );
};
export default React.memo(MyReportItem);
