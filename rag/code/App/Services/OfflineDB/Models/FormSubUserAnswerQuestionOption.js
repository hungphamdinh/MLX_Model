import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormSubUserAnswerQuestionOption extends BaseModel {
  static table = 'formSubUserAnswerQuestionOption';
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
