import { children, field, relation, action, json } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class FormPage extends BaseModel {
  static table = 'formPage';
  static associations = {
    formQuestion: {
      type: 'has_many',
      foreignKey: 'formPageGuid',
    },
    form: {
      type: 'belongs_to',
      key: 'formGuid',
    },
  };

  @children('formQuestion') questions;
  @relation('forms', 'formGuid') form;

  @field('guid') guid;
  @field('formGuid') formGuid;
  @field('name') name;
  @field('formId') formId;
  @field('isActive') isActive;
  @field('pageIndex') pageIndex;
  @field('remoteId') remoteId;
  @field('formQuestionTypeCategoryId') formQuestionTypeCategoryId;
  @field('formPageGroupId') formPageGroupId;
  @field('formPageGroupGuid') formPageGroupGuid;
  @field('formPageGroupName') formPageGroupName;

  /**
   * Delete form page
   * Delete all form questions
   * */
  // async markAsDeleted() {
  //   await this.questions.markAllAsDeleted();
  //   await super.markAsDeleted();
  // }

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formGuid: this.formGuid,
      name: this.name,
      formId: this.formId,
      isActive: this.isActive,
      pageIndex: this.pageIndex,
      remoteId: this.remoteId,
      formQuestionTypeCategoryId: this.formQuestionTypeCategoryId,
      formPageGroupId: this.formPageGroupId,
      formPageGroupGuid: this.formPageGroupGuid,
      formPageGroupName: this.formPageGroupName,
    };
  }
}
