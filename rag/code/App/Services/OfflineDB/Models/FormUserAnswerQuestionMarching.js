import { field, json, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class FormUserAnswerQuestionMarching extends BaseModel {
  static table = 'formUserAnswerQuestionMarching';

  static associations = {
    formUserAnswerQuestion: {
      type: 'belongs_to',
      key: 'formUserAnswerQuestionGuid',
    },

  };

  @relation('formUserAnswerQuestion', 'formUserAnswerQuestionGuid') formUserAnswerQuestion;

  @field('guid') guid;
  @field('formUserAnswerQuestionGuid') formUserAnswerQuestionGuid;
  @field('formUserAnswerQuestionId') formUserAnswerQuestionId;
  @field('workflowGuid') workflowGuid;
  @field('marching') marching;
  @field('isPhotographTaken') isPhotographTaken;
  @field('remoteId') remoteId;
  @json('texts', sanitizeJson) texts;
  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formUserAnswerQuestionGuid: this.formUserAnswerQuestionGuid,
      formUserAnswerQuestionId: this.formUserAnswerQuestionId,
      remoteId: this.remoteId,
      marching: this.marching,
      isPhotographTaken: this.isPhotographTaken,
      texts: this.texts,
    };
  }
}
