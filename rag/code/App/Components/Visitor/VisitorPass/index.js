import React from 'react';
import styled from 'styled-components/native';
import { ImageView, Text } from '@Elements';
import QRCode from 'react-native-qrcode-svg';
import I18n from '@I18n';
import { Colors } from '../../../Themes';
import APIConfig from '../../../Config/apiConfig';
import { formatDateTime } from '../../../Utils/common';

const Wrapper = styled.View`
  padding: 10px;
  background-color: white;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const SpaceBetweenRow = styled(RowWrapper)`
  justify-content: space-between;
`;

const Logo = styled(ImageView)`
  width: 60px;
  height: 60px;
`;

const Tenant = styled(Text)`
  margin-left: 12px;
  flex: 1;
  text-transform: uppercase;
`;

const HeaderWrapper = styled.View`
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: #011333;
  padding-horizontal: 8px;
`;

const Header = styled(Text)`
  color: white;
  font-size: 20px;
`;

const Footer = styled(Text)`
  color: white;
  text-align: center;
`;

const ReferenceNumber = styled(Text)`
  color: ${Colors.gray};
  text-align: center;
  font-size: 18px;
  margin-bottom: 30px;
`;

const InfoText = styled(Text)`
  margin-bottom: 10px;
  flex: 1;
`;

const QRCodeWrapper = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

const QRCodeView = styled(QRCode)`
  width: 140px;
  height: 140px;
  align-self: center;
`;

const RowItem = ({ valueStyle, numberOfLines = 1, label, value }) => (
  <InfoWrapper>
    <InfoText text={label} />
    <InfoText text={value} style={valueStyle} numberOfLines={numberOfLines} />
  </InfoWrapper>
);

export const VisitorPass = ({ tenant, item }) => {
  const tenantLogoUrl = `${APIConfig.apiCore}/TenantCustomization/GetTenantLogo?tenantId=${tenant.id}`;
  const footer = I18n.t('VISITOR_VISITOR_PASS_FOOTER', '', tenant.name);
  const registerTime = formatDateTime(item.registerTime);
  const registerCheckOutTime = formatDateTime(item.registerCheckOutTime);
  const registerCheckInOut = [registerTime, registerCheckOutTime].filter((time) => time !== undefined).join('\n');
  const { company } = item;

  return (
    <Wrapper>
      <SpaceBetweenRow>
        <Tenant text={tenant.name} preset="medium" />
        <Logo source={tenantLogoUrl} resizeMode="contain" />
      </SpaceBetweenRow>
      <HeaderWrapper>
        <Header text="VISITOR_PASS" preset="bold" />
      </HeaderWrapper>
      <QRCodeWrapper>
        <QRCodeView value={item.code} size={140} />
      </QRCodeWrapper>
      <ReferenceNumber text={item.code} typo="H1" preset="medium" />
      {!!item.fullUnitId && <RowItem label="COMMON_FULL_UNIT_CODE" value={item.fullUnitId} numberOfLines={2} />}
      {!!company && <RowItem label="COMPANY_CODE" value={company?.companyCode} numberOfLines={2} />}
      <RowItem label="VISITOR_PURPOSE_OF_VISIT" value={item.reasonForVisit?.name} />
      <RowItem label="COMMON_DESCRIPTION" value={item.description} numberOfLines={5} />
      <RowItem label="VISITOR_CHECK_IN_OUT" value={registerCheckInOut} numberOfLines={2} />

      <HeaderWrapper>
        <Footer text={footer} typo="P2" />
      </HeaderWrapper>
    </Wrapper>
  );
};

export default VisitorPass;
