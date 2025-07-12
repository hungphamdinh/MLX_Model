import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class Status extends BaseModel {
  static table = 'status';


  @field('guid') guid;
  @field('colorCode') colorCode;
  @field('borderColorCode') borderColorCode;
  @field('name') name;
  @field('position') position;
  @field('isDefault') isDefault;
  @field('isIssueClosed') isIssueClosed;
  @field('isIssueCancelled') isIssueCancelled;
  @field('isDeleted') isDeleted;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      colorCode: this.colorCode,
      borderColorCode: this.borderColorCode,
      name: this.name,
      position: this.position,
      isDefault: this.isDefault,
      isIssueClosed: this.isIssueClosed,
      isIssueCancelled: this.isIssueCancelled,
      isDeleted: this.isDeleted,
      remoteId: this.remoteId,


    };
  }
}
