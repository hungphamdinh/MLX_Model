import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormSubQuestionAnswer extends BaseModel {
  static table = 'formSubQuestionAnswer';

  @field('guid') guid;
  @field('formSubQuestionGuid') formSubQuestionGuid;
  @field('formSubQuestionId') formSubQuestionId;
  @field('description') description;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formSubQuestionGuid: this.formSubQuestionGuid,
      formSubQuestionId: this.formSubQuestionId,
      description: this.description,
      remoteId: this.remoteId,
    };
  }
}
