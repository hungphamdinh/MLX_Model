import React, { useEffect } from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import _ from 'lodash';
import useMeterReading from '../../../../../Context/MeterReading/Hooks/UseMeterReading';

const Wrapper = styled.View``;

const HeaderWrapper = styled.View`
  box-shadow: 0px 3px 6px #00000029;
  background-color: white;
  height: 40px;
  flex-direction: row;
  padding-horizontal: 16px;
`;

const SubView = styled.View`
  margin-left: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Col = styled.View`
  flex: 1;
  justify-content: center;
`;

const HeaderTitle = styled(Text)`
  font-size: 14px;
`;

const Body = styled.View`
  padding-horizontal: 16px;
`;

const Content = styled(Text)``;

// const mockData = _.range(0, 5).map((id) => ({ id, name: `Meter-${id}`, location: `Location-${id}` }));

const DeviceRelationshipView = ({ meterDeviceId }) => {
  const {
    meterReading: { masterDevice, subDevices },
    getMeterDeviceRelationship,
  } = useMeterReading();

  useEffect(() => {
    getMeterDeviceRelationship(meterDeviceId);
  }, []);

  const getLocationUnit = (item) => (item.location ? _.get(item, 'location.name') : _.get(item, 'unit.fullUnitCode'));

  const locationUnitText = ['COMMON_LOCATION', 'AD_CRWO_TITLE_UNIT_LOCATION'].map(I18n.t).join('/');
  return (
    <Wrapper>
      <HeaderWrapper>
        <Col>
          <HeaderTitle text="METER_READING_DEVICE_SERIAL_NAME" preset="medium" />
        </Col>
        <Col>
          <HeaderTitle text={locationUnitText} preset="medium" />
        </Col>
      </HeaderWrapper>
      <Body>
        {masterDevice && (
          <Row>
            <Col>
              <Content preset="medium" text={`${masterDevice.serialNumber}`} />
            </Col>
            <Col>
              <Content text={getLocationUnit(masterDevice)} preset="medium" />
            </Col>
          </Row>
        )}
        <SubView>
          {subDevices.map((item) => (
            <Row key={item.id}>
              <Col>
                <Content text={`- ${item.serialNumber}`} />
              </Col>
              <Col>
                <Content text={getLocationUnit(item)} />
              </Col>
            </Row>
          ))}
        </SubView>
      </Body>
    </Wrapper>
  );
};

export default DeviceRelationshipView;
