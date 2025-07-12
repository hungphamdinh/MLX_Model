/* @flow */

import get from 'lodash/get';
import React, { Component } from 'react';
import { View } from 'react-native';
import { WrapperModal, ContentChat } from '../../Components';
import { RequestCommonApi } from '../../Services';
import { connect } from '../../Utils';
import AuthContext from '../../Context/AuthContext';
import AppContext from '../../Context/AppContext';

type Props = {
  navigation: Object,
  auth: Object,
  app: Object,
};

type State = {

  loadingCommentAdmin: boolean,
  errorCommentAdmin: string,
  listCommentAdmin: Array<Object>,
  adminChatText: string,

  loadingAddComnetUser: boolean,
};


class ChatTASK extends Component<Props, State> {
  languageData: Object

  constructor(props: Props) {
    super(props);
    const { languages, languageID } = this.props.app;
    const language = languages.find(item => item.id === languageID) || {};
    this.languageData = get(language, 'data') || {};
    this.state = {

      loadingCommentAdmin: true,
      errorCommentAdmin: '',
      listCommentAdmin: [],
      adminChatText: '',

      loadingAddComnetUser: false,
    };
  }

  componentDidMount = () => {
    this.iniData();
  }

  iniData = () => {
    this.requestCommentAdmin();
  }

  requestCommentAdmin = async () => {
    this.setState({ loadingCommentAdmin: true });
    const { accessTokenAPI } = this.props.auth;
    const guid = this.props.navigation.getParam('guid') || '';
    const respones = await RequestCommonApi.requestCommentAdmin(accessTokenAPI, guid);
    if (respones.ok) {
      const data = get(respones, 'data');
      const result = get(data, 'result');
      const list = get(result, 'items');
      this.setState({
        loadingCommentAdmin: false,
        listCommentAdmin: list,
      });
    } else {
      const data = get(respones, 'data');
      const error = get(data, 'error');
      this.setState({
        errorCommentAdmin: `${error.message || ''} \n ${error.details || ''}`,
        loadingCommentAdmin: false,
      });
    }
  }

  requestAddCommentAdmin = async (comment: string) => {
    this.setState({ loadingAddComnetUser: true });
    const { accessTokenAPI } = this.props.auth;
    const { displayName, profilePictureId } = this.props.app.user || {};
    const guid = this.props.navigation.getParam('guid') || '';
    const params = {
      conversationId: guid,
      content: comment,
      typeId: null,
      isPrivate: true,
      userName: displayName,
      profilePictureId,
      moduleId: 19,
    };
    const respones = await RequestCommonApi.requestAddComment(accessTokenAPI, params);
    if (respones.ok) {
      const data = get(respones, 'data');
      if (data.success) {
        this.requestCommentAdmin();
        this.setState({
          userChatText: '',
          loadingAddComnetUser: false,
        });
      }
    } else {
      // const data = get(respones, 'data');
      // const error = get(data, 'error');
      this.setState({
        loadingAddComnetUser: false,
      });
    }
  }

  render() {
    const { listCommentAdmin, loadingCommentAdmin, errorCommentAdmin } = this.state;
    return (
      <WrapperModal
        title={this.languageData.AD_CHAT_TASK_TITLE_ADMIN || 'AD_CHAT_TASK_TITLE_ADMIN'}
        onRequestClose={() => this.props.navigation.pop()}
      >
        <View style={{ flex: 1 }}>
          <ContentChat
            emtyText={this.languageData.AD_CHAT_TASK_EMPTY || 'AD_CHAT_TASK_EMPTY'}
            emtyTextDescript={this.languageData.AD_CHAT_TASK_EMPTY_DESCRIPT || 'AD_CHAT_TASK_EMPTY_DESCRIPT'}
            placeholder={this.languageData.AD_CHAT_TASK_PLACEHOLDER || 'AD_CHAT_TASK_PLACEHOLDER'}
            listComment={listCommentAdmin}
            loading={loadingCommentAdmin}
            error={errorCommentAdmin}
            onSend={(text) => {
              this.requestAddCommentAdmin(text);
            }}
          />
        </View>
      </WrapperModal>
    );
  }
}


const mapToProps = [
  {
    context: AppContext,
    mapping: app => ({
      app,
    }),
  },
  {
    context: AuthContext,
    mapping: auth => ({
      auth,
    }),
  },
];

export default connect(ChatTASK, mapToProps);
