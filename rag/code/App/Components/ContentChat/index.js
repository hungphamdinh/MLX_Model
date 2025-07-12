/* @flow */

import isEmpty from 'lodash/isEmpty';
import _ from 'lodash';
import { FormProvider } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Text } from '@Elements';
import { BasicStyles, Colors, Metric } from '@Themes';
import useUser from '@Context/User/Hooks/UseUser';
import { FormInput } from '@Forms';
import React from 'react';
import { useCompatibleForm } from '@Utils/hook';
import { Dimensions, FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import ItemChat from './ItemChat';
import EmptyItem from './emptyItem';

const { width } = Dimensions.get('window');

const ContentChat = ({ listComment, error, loading, onSend, isTab, disable }) => {
  const {
    user: { user },
  } = useUser();

  const formMethods = useCompatibleForm({
    defaultValues: {
      comment: '',
    },
  });
  const { watch, handleSubmit, setValue } = formMethods;

  const onSendMessage = ({ comment }) => {
    if (comment && _.size(comment.trim())) {
      onSend(comment);
      setValue('comment', '');
    }
    return null;
  };

  const renderContent = () => {
    if (!loading && !isEmpty(error)) {
      return (
        <View style={BasicStyles.flexCenter}>
          <Text>{error}</Text>
        </View>
      );
    }

    if (!loading && isEmpty(error) && !_.size(listComment)) {
      return <EmptyItem />;
    }

    return (
      <FlatList
        style={BasicStyles.flex}
        contentContainerStyle={{ marginTop: 20 }}
        inverted
        data={listComment}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.id || item.commentBoxId}
        renderItem={({ item, index }) => <ItemChat index={index} item={item} user={user} />}
      />
    );
  };

  const disabled = _.size(watch('comment')) === 0;
  const disableChat = disable || false;
  const offsetKB = Metric.isIOS && isTab ? 120 : Metric.isIOS && !isTab ? 130 : 0;
  return (
    <FormProvider {...formMethods}>
      <View style={styles.container}>
        {renderContent()}
        {!disableChat && (
          <KeyboardAvoidingView enabled behavior={Metric.isIOS ? 'padding' : null} keyboardVerticalOffset={offsetKB}>
            <View style={[styles.containerViewChat, { width: width - 40 }]}>
              <FormInput
                required
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSendMessage)}
                placeholder="AD_CHAT_WO_PLACEHOLDER"
                name="comment"
                rightIcon={
                  <Button
                    onPress={handleSubmit(onSendMessage)}
                    disabled={disabled}
                    style={[styles.btnSend, { backgroundColor: disabled ? Colors.border : Colors.primary }]}
                  >
                    <Icon name="paper-plane" color={disabled ? 'gray' : 'black'} size={25} />
                  </Button>
                }
              />
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </FormProvider>
  );
};

export default ContentChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  containerViewChat: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    borderRadius: 10,
  },
  viewBtnChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 25,
    paddingRight: 5,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 25,
  },
  btnSend: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -12,
    ...BasicStyles.shadown,
  },
});
