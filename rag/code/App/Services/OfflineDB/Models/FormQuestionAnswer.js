import { field } from '@nozbe/watermelondb/decorators';
import _ from 'lodash';
import BaseModel from './BaseModel';

export default class FormQuestionAnswer extends BaseModel {
  static table = 'formQuestionAnswer';


  @field('guid') guid;
  @field('formQuestionGuid') formQuestionGuid;
  @field('formQuestionId') formQuestionId;
  @field('description') description;
  @field('formQuestionAnswerTemplateId') formQuestionAnswerTemplateId;
  @field('groupCode') groupCode;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formQuestionGuid: this.formQuestionGuid,
      formQuestionId: this.formQuestionId,
      description: this.description,
      groupCode: this.groupCode,
      formQuestionAnswerTemplateId: _.parseInt(this.formQuestionAnswerTemplateId),
      remoteId: this.remoteId,


    };
  }
}
