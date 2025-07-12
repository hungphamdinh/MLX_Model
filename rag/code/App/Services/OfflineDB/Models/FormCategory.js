import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class FormCategory extends BaseModel {
  static table = 'formCategory';


  @field('name') name;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      name: this.name,
      remoteId: this.remoteId,


    };
  }
}
