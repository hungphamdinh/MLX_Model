import { children, field, relation } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormPageGroup extends BaseModel {
  static table = 'formPageGroup';
  static associations = {
    form: {
      type: 'belongs_to',
      key: 'formGuid',
    },
  };

  @children('formPage') formPage;
  @relation('forms', 'formGuid') form;

  @field('guid') guid;
  @field('formGuid') formGuid;
  @field('name') name;
  @field('formId') formId;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formGuid: this.formGuid,
      name: this.name,
      formId: this.formId,
      remoteId: this.remoteId,
    };
  }
}
