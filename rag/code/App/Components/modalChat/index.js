/* @flow */

import React, { useEffect } from 'react';
import I18n from '@I18n';
import {
  Image,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
  SafeAreaView,
} from 'react-native';
import { ScrollableTabBar, ScrollableTabView } from '@summerkiflain/react-native-scrollable-tabview';
import { Metric, Colors } from '../../Themes';
import { Text } from '../../Elements';
import useConversation from '../../Context/Conversation/Hooks/UseConversation';
import useUser from '../../Context/User/Hooks/UseUser';
import { icons } from '../../Resources/icon';
import { isGranted } from '../../Config/PermissionConfig';
import ContentChat from '../ContentChat';

const { width } = Dimensions.get('window');

const ModalChat = ({
  onClose,
  isVisible,
  moduleId,
  guid,
  disable = false,
  disableTenant = false,
  title = '',
  tenantRoleName = 'Memo',
  readOnlyTenant = false,
}) => {
  const {
    isLoading,
    conversation: { listAdminComments, listUserComments },
    getAdminComments,
    getUserComments,
    addComment,
  } = useConversation();

  const {
    user: { user },
  } = useUser();

  useEffect(() => {
    const userSubscription = DeviceEventEmitter.addListener('add_user_comment', () => requestCommentUser());
    const adminSubscription = DeviceEventEmitter.addListener('add_admin_comment', () => requestCommentAdmin());
    iniData();

    return () => {
      userSubscription.remove();
      adminSubscription.remove();
    };
  }, []);

  const iniData = () => {
    requestCommentUser();
    requestCommentAdmin();
  };

  const requestCommentUser = async () => {
    getUserComments(guid);
  };

  const requestCommentAdmin = async () => {
    getAdminComments(guid);
  };

  const requestAddCommentUser = (comment) => {
    const { displayName, profilePictureId } = user;
    const params = {
      conversationId: guid,
      content: comment,
      typeId: null,
      isPrivate: false,
      userName: displayName,
      profilePictureId,
      moduleId,
    };
    addComment(params);
  };

  const requestAddCommentAdmin = async (comment) => {
    const { displayName, profilePictureId } = user;
    const params = {
      conversationId: guid,
      content: comment,
      typeId: null,
      isPrivate: true,
      userName: displayName,
      profilePictureId,
      moduleId,
    };
    addComment(params);
  };

  return (
    <Modal visible={isVisible}>
      <SafeAreaView />
      <View style={{ flex: 1 }}>
        <View style={styles.wrapper}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, padding: 20 }} onPress={onClose}>
            <Image source={icons.closeBlack} />
          </TouchableOpacity>
          <Text preset="medium">{`# ${title}`}</Text>
        </View>
        <View style={styles.warpperTab} />
        <ScrollableTabView
          tabBarActiveTextColor="#001335"
          tabBarInactiveTextColor="#00000029"
          tabBarUnderlineStyle={{ backgroundColor: '#D0A416' }}
          // tabBarBackgroundColor="white"
          renderTabBar={() => (disableTenant ? <View /> : <ScrollableTabBar />)}
        >
          {!disableTenant && isGranted(`${tenantRoleName}.Read`) && (
            <ContentChat
              disable={disable || readOnlyTenant || !isGranted(`${tenantRoleName}.Reply`)}
              tabLabel={I18n.t('AD_CHAT_WO_TITLE_USER')}
              listComment={listUserComments}
              loading={isLoading}
              error=""
              onSend={(text) => {
                requestAddCommentUser(text);
              }}
            />
          )}

          <ContentChat
            disable={disable}
            isTab
            tabLabel={I18n.t('AD_CHAT_WO_TITLE_ADMIN')}
            emtyText={I18n.t('AD_CHAT_WO_EMPTY')}
            emtyTextDescript={I18n.t('AD_CHAT_WO_EMPTY_DESCRIPT')}
            placeholder={I18n.t('AD_CHAT_WO_PLACEHOLDER')}
            listComment={listAdminComments}
            loading={isLoading}
            error=""
            onSend={(text) => {
              requestAddCommentAdmin(text);
            }}
          />
        </ScrollableTabView>
      </View>
    </Modal>
  );
};

export default ModalChat;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgWhite,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  warpperTab: {
    flexDirection: 'row',
    backgroundColor: Colors.bgWhite,
    zIndex: 1,
  },
  btnTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Metric.space5,
    borderRadius: Metric.borderRadius10,
  },
  wrapper: {
    width,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
