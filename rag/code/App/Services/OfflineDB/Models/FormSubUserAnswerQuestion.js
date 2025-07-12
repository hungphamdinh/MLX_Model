import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormSubUserAnswerQuestion extends BaseModel {
  static table = 'formSubUserAnswerQuestion';

  @field('guid') guid;
  @field('formUserAnswerGuid') formUserAnswerGuid;
  @field('formUserAnswerId') formUserAnswerId;
  @field('questionId') questionId;
  @field('questionGuid') questionGuid;
  @field('answerContent') answerContent;
  @field('answerDate') answerDate;
  @field('answerNumeric') answerNumeric;
  @field('comment') comment;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formUserAnswerGuid: this.formUserAnswerGuid,
      formUserAnswerId: this.formUserAnswerId,
      answerContent: this.answerContent,
      answerDate: this.answerDate,
      answerNumeric: this.answerNumeric,
      comment: this.comment,
      questionGuid: this.questionGuid,
      questionId: this.questionId,
      remoteId: this.remoteId,
    };
  }
}
