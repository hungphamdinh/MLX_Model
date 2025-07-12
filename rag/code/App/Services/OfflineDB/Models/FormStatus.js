import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class FormStatus extends BaseModel {
  static table = 'formStatus';

  @field('code') code;
  @field('name') name;
  @field('isActive') isActive;
  @field('order') order;
  @field('moduleId') moduleId;
  @field('colorCode') colorCode;
  @field('borderColorCode') borderColorCode;
  @field('remoteId') remoteId;

  getValue() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      isActive: this.isActive,
      order: this.order,
      moduleId: this.moduleId,
      colorCode: this.colorCode,
      borderColorCode: this.borderColorCode,
      remoteId: this.remoteId,
    };
  }
}
