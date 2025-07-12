import React, { useState } from 'react';
import { View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Text, Card } from '@Elements';
import { Colors } from '@Themes';
import _ from 'lodash';
import { FormDocumentPicker } from '@Forms';
import styled from 'styled-components/native';
import moment from 'moment';

export const SectionHeader = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SectionBody = styled.View`
  margin-top: 6px;
  padding-left: 4px;
`;

const Table = styled.View`
  width: 100%;
  border-top-width: 1px;
  border-top-color: ${Colors.border};
  margin-top: 8px;
`;

const TableRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: ${Colors.border};
`;

const TableCell = styled.View`
  flex: 1;
  padding: 8px;
`;

const TableHeaderCell = styled(TableCell)`
  background-color: ${Colors.backgroundLight || Colors.border};
`;

const TableHeaderText = styled(Text)`
  font-weight: bold;
`;

const BookingPolicyRules = ({ amenityDetail, bookingRuleFiles }) => {
  const [open, setOpen] = useState(false);

  const sections = [
    {
      key: 'policy',
      show: !!amenityDetail.policyNote,
      label: 'BOOKING_POLICIES',
      render: () => <Text text={amenityDetail.policyNote} />,
    },
    {
      key: 'remark',
      show: !!amenityDetail.remark,
      label: 'AMENITY_REMARK',
      render: () => <Text text={amenityDetail.remark} />,
    },
    {
      key: 'docs',
      show: _.size(bookingRuleFiles) > 0,
      label: '',
      render: () => (
        <FormDocumentPicker testID="amenity-docs" label="COMMON_DOCUMENT" name="bookingRuleFiles" disabled />
      ),
    },
    {
      key: 'rules',
      show: Array.isArray(amenityDetail.amenityTimeRules) && amenityDetail.amenityTimeRules.length > 0,
      label: 'BOOKING_AMENITY_RULES',
      render: () => (
        <Table>
          <TableRow>
            <TableHeaderCell>
              <TableHeaderText text="COMMON_DATE" />
            </TableHeaderCell>
            <TableHeaderCell>
              <TableHeaderText text="BOOKED_TIME" />
            </TableHeaderCell>
          </TableRow>
          {amenityDetail.amenityTimeRules.map((slot, i) => (
            <TableRow key={i.toString()}>
              <TableCell>
                <Text text={slot.numNextValidDate} />
              </TableCell>
              <TableCell>
                <Text
                  text={`${moment(slot.startTime, 'HH:mm:ss').format('HH:mm')} – ${moment(
                    slot.endTime,
                    'HH:mm:ss'
                  ).format('HH:mm')}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ),
    },
  ];

  const visible = sections.filter((s) => s.show);
  if (!visible.length) return null;

  return (
    <View>
      <SectionHeader onPress={() => setOpen(!open)}>
        <Text preset="bold" text="BOOKING_POLICY_RULE" />
        <Ionicon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.text} />
      </SectionHeader>

      {open && (
        <Card style={{ marginHorizontal: -5, marginTop: 10 }}>
          {visible.map(({ key, label, render }) => (
            <View key={key} style={{ marginBottom: 12 }}>
              {label && <Text preset="bold" text={label} />}
              {render()}
            </View>
          ))}
        </Card>
      )}
    </View>
  );
};

export default BookingPolicyRules;
