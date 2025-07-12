import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class Priority extends BaseModel {
  static table = 'priority';


  @field('guid') guid;
  @field('name') name;
  @field('position') position;
  @field('isActive') isActive;
  @field('isDefault') isDefault;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      name: this.name,
      position: this.position,
      isActive: this.isActive,
      isDefault: this.isDefault,
      remoteId: this.remoteId,


    };
  }
}
