import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import { icons } from '../../../../Resources/icon';
import useUser from '../../../../Context/User/Hooks/UseUser';
import get from 'lodash/get';
// import IMG_AVATAR_DEFAULT from "@resources/icons/avatar-default.png";

const Wrapper = styled.View`
  height: 81px;
  flex-direction: row;
  align-items: center;
  background-color: #001335;
  padding-left: 15px;
  padding-right: 15px;
`;

const Name = styled(Text)`
  font-size: 18px;
  color: white;
`;

const Unit = styled(Text)`
  font-size: 11px;
  color: #e2e2e2;
`;

const Avatar = styled.Image`
  width: 52px;
  height: 52px;
  border-radius: 26px;
`;

const InfoWrapper = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const EditButton = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const EditIcon = styled.Image``;

const ChangeTenantBtn = styled.TouchableOpacity`
  margin-right: 15px;
`;

const ChangeTenantIcon = styled.Image`
  width: 25px;
  height: 25px;
`;

const AvatarBar = ({ onPress }) => {
  const {
    user: { tenant, user, profilePicture, accountUserId },
    getLinkedAccount,
  } = useUser();
  const userName = get(user, 'displayName') || '';
  const tenantName = get(tenant, 'name') || '';

  const avatar = _.size(profilePicture) > 0 ? { uri: profilePicture } : icons.avatarDefault;

  const onChangeTenant = () => {
    getLinkedAccount({
      userId: accountUserId,
    });
    NavigationService.navigateFromRoot('selectTenant');
  };

  return (
    <Wrapper>
      <Avatar source={avatar} />
      <InfoWrapper>
        <Name text={userName} />
        <Unit text={tenantName} />
      </InfoWrapper>
      <ChangeTenantBtn onPress={onChangeTenant}>
        <ChangeTenantIcon source={icons.changeTenant} resizeMode="contain" />
      </ChangeTenantBtn>
      <EditButton onPress={onPress}>
        <EditIcon source={icons.edit} />
      </EditButton>
    </Wrapper>
  );
};

export default AvatarBar;
