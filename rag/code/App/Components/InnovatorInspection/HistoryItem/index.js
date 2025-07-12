import React, { Fragment } from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { Text, IconButton, Card } from '../../../Elements';
import Row from '../../Grid/Row';
import { getDate, getTime } from '../../../Utils/convertDate';

const RowWrapper = styled(Row)`
  justify-content: space-between;
`;

const Label = styled(Text)`
  flex: 0.4;
`;

const Content = styled(Text)`
  flex: 0.6;
  margin-left: 10px;
`;

const Section = styled(TouchableOpacity)`
  background-color: white;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
`;

const TitleWrapper = styled(Row)`
  margin-vertical: 5px;
`;

const HistoryItem = ({ item, index }) => {
  const [data, setData] = React.useState(item);

  React.useEffect(() => {
    setData(item);
  }, [item.isShowLess]);

  React.useEffect(() => {
    if (index === 0) {
      setData({
        ...item,
        isShowLess: true,
      });
    }
  }, []);

  const onPress = () => {
    setData({
      ...data,
      isShowLess: !data.isShowLess,
    });
  };

  return (
    <Fragment>
      <Section testID="section" onPress={onPress}>
        <RowWrapper center>
          <Text preset="bold" text={getDate(item.dateGroup)} />
          <IconButton
            testID="buttonExpand"
            disabled
            name={!data.isShowLess ? 'chevron-down-outline' : 'chevron-up-outline'}
          />
        </RowWrapper>
      </Section>
      {data.isShowLess && (
        <Fragment>
          {data.changes.map((child) => (
            <Card key={`${child.id}`}>
              <LabelValue label="INSPECTION_HISTORY_MODIFIED_TIME" content={getTime(child.creationTime)} />
              <LabelValue label="INSPECTION_HISTORY_OBJECT" content={child.title} />
              <LabelValue label="INSPECTION_HISTORY_ACTION" content={child.actionType} />
              <LabelValue label="INSPECTION_HISTORY_OLD_VALUE" content={child.oldValue} />
              <LabelValue label="INSPECTION_HISTORY_NEW_VALUE" content={child.newValue} />
            </Card>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
};
export default HistoryItem;

const LabelValue = ({ label, content }) => (
  <TitleWrapper>
    <Label preset="bold" text={label} />
    <Content text={content} />
  </TitleWrapper>
);
