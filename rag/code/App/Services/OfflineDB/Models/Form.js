import _ from 'lodash';
import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class Form extends BaseModel {
  static table = 'form';

  static associations = {
    formCategory: {
      type: 'belongs_to',
      foreignKey: 'formCategoryId',
    },
    formStatus: {
      type: 'belongs_to',
      foreignKey: 'statusId',
    },
    formPage: {
      type: 'has_many',
      foreignKey: 'formGuid',
    },
  };

  @children('formPage') formPages;
  @relation('formCategory', 'formCategoryId') category;
  @relation('formStatus', 'statusId') formStatus;

  @field('guid') guid;
  @field('formName') formName;
  @field('formGroupId') formGroupId;
  @field('formCategoryId') formCategoryId;
  @field('moduleId') moduleId;
  @field('statusId') statusId;
  @field('tenantId') tenantId;
  @field('header') header;
  @field('footer') footer;
  @field('isActive') isActive;
  @field('publicTime') publicTime;
  @field('creatorUserId') creatorUserId;
  @field('remoteId') remoteId;
  @field('isReadOnly') isReadOnly;
  @field('type') type;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formName: this.formName,
      formGroupId: this.formGroupId,
      formCategoryId: this.formCategoryId,
      moduleId: this.moduleId,
      statusId: this.statusId,
      tenantId: this.tenantId,
      header: this.header,
      footer: this.footer,
      isActive: this.isActive,
      publicTime: this.publicTime,
      remoteId: this.remoteId,
      category: this.category,
      creatorUserId: _.parseInt(this.creatorUserId),
      isReadOnly: this.isReadOnly,
      type: this.type,
    };
  }

  // /**
  //  * clone form, formPages, form Questions, form Question answers
  //  * */
  // async clone() {
  //   const formCollection = database.get('forms');
  //   console.log('this is ', this);
  //   await database.action(() => formCollection.create((obj) => {
  //     this.useCurrentValue(obj);
  //   }));
  // }

  // async getFull() {
  //     return  {
  //       ...this.getValue(),
  //       questionType: this.
  //     }
  // }
}
