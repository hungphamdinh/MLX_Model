import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class FormUserAnswer extends BaseModel {
  static table = 'formUserAnswer';


  @field('guid') guid;
  @field('parentId') parentId;
  @field('parentGuid') parentGuid ;
  @field('moduleId') moduleId;
  @field('userAnswerId') userAnswerId;
  @field('unitId') unitId;
  @field('statusId') statusId;
  @field('fullUnitCode') fullUnitCode;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      parentId: this.parentId,
      parentGuid: this.parentGuid,
      moduleId: this.moduleId,
      userAnswerId: this.userAnswerId,
      unitId: this.unitId,
      statusId: this.statusId,
      fullUnitCode: this.fullUnitCode,
      remoteId: this.remoteId,
    };
  }
}
