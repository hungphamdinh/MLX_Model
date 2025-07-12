import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormSubQuestion extends BaseModel {
  static table = 'formSubQuestion';

  @field('guid') guid;
  @field('formQuestionGuid') formQuestionGuid;
  @field('formQuestionId') formQuestionId;
  @field('description') description;
  @field('isMultiAnswer') isMultiAnswer;
  @field('formQuestionTypeId') formQuestionTypeId;
  @field('isDescriptionDefined') isDescriptionDefined;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formQuestionGuid: this.formQuestionGuid,
      formQuestionId: this.formQuestionId,
      description: this.description,
      isMultiAnswer: this.isMultiAnswer,
      formQuestionTypeId: this.formQuestionTypeId,
      isDescriptionDefined: this.isDescriptionDefined,
      remoteId: this.remoteId,
    };
  }
}
