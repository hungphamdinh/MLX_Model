import { field, relation, } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormUserAnswerQuestionOption extends BaseModel {
  static table = 'formUserAnswerQuestionOption';
  static associations = {
    formUserAnswerQuestion: {
      type: 'belongs_to',
      key: 'formUserAnswerQuestionGuid',
    },
    formQuestionAnswer: {
      type: 'belongs_to',
      key: 'formQuestionAnswerGuid',
    },
  };

  @relation('formUserAnswerQuestion', 'formUserAnswerQuestionGuid') formUserAnswerQuestion;
  @relation('formQuestionAnswer', 'formQuestionAnswerGuid') formQuestionAnswer;

  @field('guid') guid;
  @field('formUserAnswerQuestionGuid') formUserAnswerQuestionGuid;
  @field('formUserAnswerQuestionId') formUserAnswerQuestionId;
  @field('formQuestionAnswerGuid') formQuestionAnswerGuid;
  @field('formQuestionAnswerId') formQuestionAnswerId;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formUserAnswerQuestionGuid: this.formUserAnswerQuestionGuid,
      formUserAnswerQuestionId: this.formUserAnswerQuestionId,
      formQuestionAnswerGuid: this.formQuestionAnswerGuid,
      formQuestionAnswerId: this.formQuestionAnswerId,
      remoteId: this.remoteId,
    };
  }
}
