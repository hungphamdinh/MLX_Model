import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormGroup extends BaseModel {
  static table = 'formGroup';


  @field('name') name;
  @field('isActive') isActive;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      remoteId: this.remoteId,


    };
  }
}
