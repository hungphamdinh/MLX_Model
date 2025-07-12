import { children, field, relation } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormQuestion extends BaseModel {
  static table = 'formQuestion';

  static associations = {
    formPage: {
      type: 'belongs_to',
      key: 'formPageGuid',
    },
    formQuestionType: {
      type: 'belongs_to',
      key: 'formQuestionTypeId',
    },
    formQuestionAnswer: {
      type: 'has_many',
      foreignKey: 'formQuestionGuid',
    },
    formUserAnswerQuestion: {
      type: 'belongs_to',
      foreignKey: 'questionGuid',
    },
  };

  @relation('formPages', 'formPageGuid') formPage;
  @relation('formQuestionType', 'formQuestionTypeId') formQuestionType;
  @relation('formUserAnswerQuestion', 'questionGuid') formUserAnswerQuestion;
  @children('formQuestionAnswer') answers;

  @field('guid') guid;
  @field('formPageGuid') formPageGuid;
  @field('formPageId') formPageId;
  @field('description') description;
  @field('formQuestionTypeId') formQuestionTypeId;
  @field('isMandatory') isMandatory;
  @field('isActive') isActive;
  @field('isAllowComment') isAllowComment;
  @field('isRequiredImage') isRequiredImage;
  @field('isRequiredLocation') isRequiredLocation;
  @field('isScore') isScore;
  @field('isMultiAnswer') isMultiAnswer;
  @field('isIncludeTime') isIncludeTime;
  @field('isImage') isImage;
  @field('labelFrom') labelFrom;
  @field('labelTo') labelTo;
  @field('questionIndex') questionIndex;
  @field('groupCode') groupCode;
  @field('remoteId') remoteId;
  @field('isDeclareQuantity') isDeclareQuantity;
  @field('isDeclareQuantityMandatory') isDeclareQuantityMandatory;
  @field('projectTypeId') projectTypeId;
  @field('budgetCode') budgetCode;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formPageGuid: this.formPageGuid,
      formPageId: this.formPageId,
      description: this.description,
      formQuestionTypeId: this.formQuestionTypeId,
      isMandatory: this.isMandatory,
      isActive: this.isActive,
      isAllowComment: this.isAllowComment,
      isMultiAnswer: this.isMultiAnswer,
      isIncludeTime: this.isIncludeTime,
      isImage: this.isImage,
      isRequiredImage: this.isRequiredImage,
      isRequiredLocation: this.isRequiredLocation,
      isScore: this.isScore,
      labelFrom: this.labelFrom,
      labelTo: this.labelTo,
      questionIndex: this.questionIndex,
      groupCode: this.groupCode,
      remoteId: this.remoteId,
      isDeclareQuantity: this.isDeclareQuantity,
      isDeclareQuantityMandatory: this.isDeclareQuantityMandatory,
      projectTypeId: this.projectTypeId,
      budgetCode: this.budgetCode,
    };
  }

  async getDetail() {
    const formQuestionType = await this.formQuestionType;

    return {
      ...this.getValue(),
      formQuestionType,
    };
  }
}
