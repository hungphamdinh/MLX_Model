import { field } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';
import _ from 'lodash';
import {Model} from '@nozbe/watermelondb';

export default class FormQuestionType extends BaseModel {
  static table = 'formQuestionType';


  @field('name') name;
  @field('isActive') isActive;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: _.parseInt(this.id),
      name: this.name,
      isActive: this.isActive,
      remoteId: this.remoteId,


    };
  }
}
