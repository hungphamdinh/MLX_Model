/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import styled from 'styled-components/native';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text } from '@Elements';
import withModal from '@HOC/ModalHOC';
import I18n from '@I18n';
import Row from '../../Components/Grid/Row';
import { AlertNative } from '../../Components';
import { Colors } from '../../Themes';
import useInspection from '../../Context/Inspection/Hooks/UseInspection';
import { icons } from '../../Resources/icon';
import { Icon, IconButton } from '../../Elements';
import { modal } from '../../Utils';

const Wrapper = styled.View`
  margin-top: -10px;
  margin-bottom: 20px;
`;

const InfoWrapper = styled(TouchableOpacity)`
  margin-top: 12px;
`;

const ValueWrapper = styled.View`
  height: 42px;
  border-radius: 21px;
  background-color: ${({ disabled }) => (disabled ? Colors.disabled : 'white')};
  padding-horizontal: 10px;
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
`;

const Label = styled(Text)`
  font-size: 15px;
  margin-left: 0px;
  color: #001335;
`;

const Value = styled(Text)`
  margin-left: 5px;
  flex: 1;
`;

const IconItem = styled(Icon)`
  margin-left: 5px;
`;

const Space = styled.View`
  margin-horizontal: 5px;
`;

const AddSignatureModal = ({
  onComplete,
  onAddSignature,
  onDetailSignature,
  onRemoveSignature,
  onPressSave,
  isRequiredSignature,
  setSignatureVisible,
}) => {
  const {
    inspection: { signatories },
  } = useInspection();

  const onAskSkip = () => {
    AlertNative(
      I18n.t('INSPECTION_SKIP_SIGNATURE'),
      I18n.t('INSPECTION_SKIP_SIGNATURE_MESSAGE'),
      onComplete,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  const onSubmit = () => {
    onComplete();
  };

  const onPressComplete = () => {
    setSignatureVisible(false);
    const checkedSignatures = signatories.find((item) => item.title);
    if (checkedSignatures) {
      onSubmit();
      return;
    }
    if (isRequiredSignature) {
      modal.showError('INSPECTION_SIGNATURE_REQUIRED_ERROR', () => setSignatureVisible(true));
      return;
    }
    onAskSkip();
  };
  return (
    <View style={{ backgroundColor: Colors.bgMain }}>
      <Wrapper>
        {signatories.map((item, index) => (
          <SignatureItem
            onPressDetail={() => onDetailSignature(item)}
            onPressAdd={() => onAddSignature(item, index + 1)}
            onPressRemove={() => onRemoveSignature(item)}
            displayText={item?.title}
            label={`${I18n.t('INSPECTION_SIGNATORY')} ${index + 1}`}
          />
        ))}
      </Wrapper>
      <Row style={styles.actionContainer}>
        <Button rounded primary title={I18n.t('INSPECTION_SAVE_SIGNATURE')} onPress={onPressSave} />
        <Space />
        <Button rounded primary title={I18n.t('INSPECTION_COMPLETE_JOB')} onPress={onPressComplete} />
      </Row>
    </View>
  );
};

export default withModal(AddSignatureModal, 'INSPECTION_ENTER_THE_NAME_OF_SIGNATORIES');

const styles = StyleSheet.create({
  header: {
    marginVertical: 30,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionContainer: {
    justifyContent: 'center',
  },
});

const SignatureItem = ({ label, displayText, onPressDetail, onPressRemove, onPressAdd }) => (
  <InfoWrapper onPress={displayText ? onPressDetail : onPressAdd}>
    <Label text={`${I18n.t(label)}`} preset="medium" />
    <ValueWrapper>
      <Value text={displayText} />
      {displayText ? (
        <Row>
          <IconButton
            onPress={onPressDetail}
            containerStyle={{ width: null, marginLeft: 5 }}
            size={20}
            color={Colors.azure}
            name="eye-outline"
          />
          <IconButton
            onPress={onPressRemove}
            containerStyle={{ width: null, marginLeft: 5 }}
            size={20}
            color="red"
            name="close-circle-outline"
          />
        </Row>
      ) : (
        <Button onPress={onPressAdd}>
          <IconItem tintColor={Colors.azure} size={15} source={icons.signature} />
        </Button>
      )}
    </ValueWrapper>
  </InfoWrapper>
);
