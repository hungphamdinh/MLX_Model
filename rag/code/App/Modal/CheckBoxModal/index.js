import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import I18n from '@I18n';
import Row from '../../Components/Grid/Row';
import { Colors } from '../../Themes';
import { Button, Text } from '../../Elements';
import { CheckBox } from '../../Components/Forms/FormCheckBox';
import { withModal } from '../../HOC';

const CheckBoxModal = ({ onSubmit, data, buttonTitle = 'COMMON_SAVE', ...props }) => {
  const [eSignList, setESignList] = useState([]);

  useEffect(() => {
    setESignList(data);
  }, []);

  const checkItem = (item) => {
    const newData = eSignList.map((child) => {
      if (item.id === child.id) {
        return {
          ...child,
          isCheck: true
        };
      }
      return {
        ...child,
        isCheck: false
      };
    });
    setESignList(newData);
  };

  const submit = () => {
    onSubmit(eSignList.filter((item) => item.isCheck)[0]);
    props.onClosePress();
  };
  return (
      <View style={styles.wrapper}>
        <View style={styles.contentContainer}>
          {eSignList.map((item) => (
            <Row style={styles.checkBox}>
              <CheckBox testID={`checkbox-${item.id}`} key={`${item.id}`} disabled={item.disabled} value={item.isCheck} onCheckBoxPress={() => checkItem(item)} />
              <Text style={{ marginLeft: 10, color: !item.disabled ? Colors.text : Colors.textSemiGray }} text={I18n.t(item.title)} />
            </Row>
          ))}
        </View>

        <Row style={styles.actionContainer}>
          <Button
            testID="buttonSign"
            block
            primary
            rounded
            title={I18n.t(buttonTitle)}
            onPress={submit}
          />
        </Row>
      </View>
  );
};

export default withModal(CheckBoxModal, '');

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 10,
  },
  actionContainer: {
    justifyContent: 'space-around',
  },
  wrapper: {
    paddingHorizontal: 10,
  },
  checkBox: {marginBottom: 10},
});
