import React from 'react';
import styled from 'styled-components/native';

import I18n from '@I18n';
import { Linking, Modal, Platform } from 'react-native';
import { APP_STORE_LINK, PLAY_STORE_LINK } from '../../Config';
import { Fonts } from '../../Themes';
import useApp from '../../Context/App/Hooks/UseApp';
import Row from '../../Components/Grid/Row';
import { Button, Text } from '../../Elements';

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.View`
  align-items: center;
`;

const ActionWrapper = styled(Row)`
  justify-content: space-around;
  margin-top: 30px;
`;

const ModalWrapper = styled.View`
  background-color: white;
  border-radius: 14px;
  padding-horizontal: 16px;
  padding-top: 20px;
  padding-bottom: 10px;
  width: 90%;
`;

const ModalUpdateVersion = () => {
  const {
    app: { haveNewVersion },
  } = useApp();
  const onDonePress = () => {
    const link = Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK;
    Linking.openURL(link);
  };

  return (
    <Modal visible={haveNewVersion} style={{ margin: 0 }}>
      <Backdrop>
        <ModalWrapper>
          <TitleWrapper>
            <Text
              style={{ marginBottom: 15, fontSize: 15, fontWeight: 'bold' }}
              fontFamily={Fonts.Bold}
              text={I18n.t('AD_MODAL_FORCE_UPDATE_TITLE')}
            />
            <Text
              style={{ paddingHorizontal: 10, fontSize: 14 }}
              text={I18n.whiteLabelTranslate('AD_MODAL_FORCE_UPDATE_BODY')}
            />
          </TitleWrapper>

          <ActionWrapper center>
            <Button title="OK" primary rounded containerStyle={{ minWidth: 100 }} onPress={onDonePress} />
          </ActionWrapper>
        </ModalWrapper>
      </Backdrop>
    </Modal>
  );
};

export default ModalUpdateVersion;
