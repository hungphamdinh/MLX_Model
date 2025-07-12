import { children, field, relation } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormUserAnswerQuestion extends BaseModel {
  static table = 'formUserAnswerQuestion';

  static associations = {
    formUserAnswerQuestionOption: {
      type: 'has_many',
      foreignKey: 'formUserAnswerQuestionGuid',
    },
    formUserAnswerQuestionImage: {
      type: 'has_many',
      foreignKey: 'formUserAnswerQuestionGuid',
    },
    formUserAnswerQuestionMarching: {
      type: 'has_many',
      foreignKey: 'formUserAnswerQuestionGuid',
    },
    formUserAnswer: {
      type: 'belongs_to',
      key: 'formUserAnswerGuid',
    },
  };

  @children('formUserAnswerQuestionOption') options;
  @children('formUserAnswerQuestionImage') images;
  @relation('formUserAnswerQuestionMarching', 'formUserAnswerQuestionGuid') formUserAnswerQuestionMarching;
  @relation('formUserAnswer', 'formUserAnswerGuid') formUserAnswer;

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
  @field('declareQuantity') declareQuantity;
  @field('defectDescription') defectDescription;
  @field('isDefect') isDefect;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formUserAnswerGuid: this.formUserAnswerGuid,
      formUserAnswerId: this.formUserAnswerId,
      questionId: this.questionId,
      answerContent: this.answerContent,
      answerDate: this.answerDate,
      answerNumeric: this.answerNumeric,
      comment: this.comment,
      questionGuid: this.questionGuid,
      remoteId: this.remoteId,
      declareQuantity: this.declareQuantity,
      defectDescription: this.defectDescription,
      isDefect: this.isDefect
    };
  }

  /**
   * Delete formUserAnswerQuestion
   * */
  // async markAsDeleted() {
  //   // await this.options.markAsDeleted();
  //   // await this.images.markAsDeleted();
  //   await super.markAsDeleted();
  // }
}
