import React, { useEffect, useState, useRef } from 'react';
import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { Button, Text } from '@Elements';
import I18n from '@I18n';
import useApp, { clearAuth } from '../../../Context/App/Hooks/UseApp';
import apiConfig from '../../../Config/apiConfig';
import useUser from '../../../Context/User/Hooks/UseUser';
import Row from '../../Grid/Row';
import { withModal } from '../../../HOC';
import { toast } from '../../../Utils';
import useCountdown from '../Hooks/useCountdown';
import { DURATION_TIMEOUT_BEFORE_IN_APP_NOTICE } from '../../../Config';
import { handleTimeUntilExpire, transformTimeToShow } from '../../../Utils/transformData';

const ButtonWrapper = styled(Row)`
  margin-top: 20px;
  justify-content: space-around;
`;

const Wrapper = styled.View`
  padding-horizontal: 10px;
`;

const Content = styled(Text)`
  margin-bottom: 10px;
`;

const ExpirePopup = withModal(({ remainingSeconds }) => {
  const { logout } = useApp();
  const [remainingTime, setRemainingTime] = useState();

  const { setStayedLoggedIn } = useUser();
  const { startInterval, stopInterval } = useCountdown(1000, () => {
    setRemainingTime((prevTime) => prevTime - 1);
  });

  useEffect(() => {
    if (remainingTime <= 0) {
      stopInterval();
      clearAuth();
    }
  }, [remainingTime]);

  useEffect(() => {
    setRemainingTime(remainingSeconds);
    if (remainingSeconds) {
      startInterval();
    }
  }, [remainingSeconds]);

  const onLogoutPress = () => {
    logout();
  };

  const btStayedLoggedInPress = () => {
    setStayedLoggedIn(true);
  };

  const { minutes, seconds } = transformTimeToShow(remainingTime);
  const secondContent = I18n.t('DURATION_EXPIRE_SECOND_CONTENT', null, minutes, seconds);

  return (
    <Wrapper>
      <Content text="DURATION_EXPIRE_FIRST_CONTENT" />
      <Content text={secondContent} />
      <RNText>
        <Content preset="medium" text={`${I18n.t('DURATION_EXPIRE_STAYED_LOGGED_IN')} `} />
        <Content text="DURATION_EXPIRE_THIRD_CONTENT" />
      </RNText>
      <ButtonWrapper center>
        <Button block primary rounded title="DURATION_EXPIRE_STAYED_LOGGED_IN" onPress={btStayedLoggedInPress} />
        <Button block info rounded title="LOGOUT" onPress={onLogoutPress} />
      </ButtonWrapper>
    </Wrapper>
  );
}, 'DURATION_EXPIRE_TITLE');

const DurationExpireModal = () => {
  const {
    user: { isLoggedIn, stayedLoggedIn },
  } = useUser();
  const checkExpireTimeoutRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(undefined);

  const checkTokenExpired = () => {
    try {
      clearCheckExpireTimeout();
      if (_.size(apiConfig.accessTokenAPI)) {
        const beforeExpireSeconds = DURATION_TIMEOUT_BEFORE_IN_APP_NOTICE * 60;
        const timeUntilExpiration = handleTimeUntilExpire(apiConfig.accessTokenAPI);
        if (timeUntilExpiration < 0) {
          // already expired
          clearAuth();
          return true;
        }
        setRemainingSeconds(timeUntilExpiration);
        if (timeUntilExpiration < beforeExpireSeconds && timeUntilExpiration > 0) {
          setIsModalVisible(true);
          return true;
        }
        // not expired yet
        checkExpireTimeoutRef.current = setTimeout(() => {
          checkTokenExpired();
        }, (remainingSeconds - beforeExpireSeconds) * 1000);

        return false;
      }
    } catch (e) {
      toast.showError(e.message);
    }
    return false;
  };

  clearCheckExpireTimeout = () => {
    if (checkExpireTimeoutRef.current) {
      clearTimeout(checkExpireTimeoutRef.current);
    }
  };

  useEffect(() => {
    checkTokenExpired();
  }, [apiConfig, isLoggedIn]);

  useEffect(
    () => () => {
      clearCheckExpireTimeout();
    },
    [checkExpireTimeoutRef.current]
  );

  if (!isModalVisible || !isLoggedIn || stayedLoggedIn) return null;

  return <ExpirePopup visible remainingSeconds={remainingSeconds} />;
};

export default DurationExpireModal;
