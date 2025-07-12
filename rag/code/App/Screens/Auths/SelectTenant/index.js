import React, { useState } from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { Button, Text } from '@Elements';
import useUser from '../../../Context/User/Hooks/UseUser';
import { icons } from '../../../Resources/icon';
import { images } from '../../../Resources/image';
import TenantSelect from '../../../Components/Auths/TenantSelect';

const Wrapper = styled.View`
  flex: 1;
`;

const InfoWrapper = styled.View`
  margin-horizontal: 40px;
  flex: 1;
`;

const Logo = styled.Image`
  width: 150px;
  height: 150px;
  margin-top: 15px;
`;

const LogoContainer = styled.SafeAreaView`
  align-items: center;
  background-color: #f0f0f0;
`;

const Wallpaper = styled.ImageBackground`
  width: 100%;
  height: 300px;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 70px;
  z-index: -1;
`;

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  font-size: 30px;
  margin-top: 50px;
`;

const Subtitle = styled(Text)`
  color: black;
  font-size: 18px;
  margin-bottom: 34px;
`;

const SelectTenant = () => {
  // {
  //   actions,
  //     account: { tenantOptions, tenant, tenants },
  //   units: { unitOptions, listUnits, unitActive },
  // }
  const {
    user: { tenants, account, accountUserId },
    switchToUserAccount,
  } = useUser();

  const [property, setProperty] = useState(undefined);

  const onNextPress = async () => {
    switchToUserAccount({
      tenant: property,
      userId: account ? account.userId : accountUserId,
    });
  };

  const tenantSelectProps = {
    options: tenants,
    icon: icons.property,
    value: property,
    placeholder: 'LOGIN_SELECT_PROPERTY',
    showSearchBar: true,
    onChange: (tenant) => {
      setProperty(tenant);
    },
  };

  return (
    <Wrapper>
      <LogoContainer>
        <Logo source={images.logo} resizeMode="contain" />
      </LogoContainer>
      <InfoWrapper>
        <Title text="LOGIN_SELECT_PROPERTY" />
        <Subtitle text={I18n.whiteLabelTranslate('LOGIN_SIGN_IN_SUB_TITLE')} />
        <TenantSelect {...tenantSelectProps} />
      </InfoWrapper>

      <Wallpaper source={images.loginBackground}>
        <Button
          disabled={!property}
          primary
          rounded
          title="COMMON_NEXT"
          onPress={onNextPress}
          containerStyle={{ minWidth: 150 }}
        />
      </Wallpaper>
    </Wrapper>
  );
};

export default SelectTenant;
