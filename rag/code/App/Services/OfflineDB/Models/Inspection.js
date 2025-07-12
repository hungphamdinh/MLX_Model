import { field, json, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';
import { fetchRelationAllowNull } from '../Mgr/BaseMgr';

export default class Inspection extends BaseModel {
  static table = 'inspection';
  static associations = {
    inspectionProperty: {
      type: 'belongs_to',
      foreignKey: 'inspectionPropertyId',
    },
    workflow: {
      type: 'belongs_to',
      foreignKey: 'parentGuid',
    },
    formUserAnswer: {
      type: 'belongs_to',
      foreignKey: 'parentGuid',
    },
    // category: { type: 'belongs_to', foreignKey: 'category_form_id' },
  };
  @relation('inspectionProperty', 'inspectionPropertyId') property;
  @relation('workflow', 'parentGuid') workflow;
  @relation('formUserAnswer', 'parentGuid') formUserAnswer;

  @field('guid') guid;
  @field('sourceId') sourceId;
  @field('inspectionPropertyId') inspectionPropertyId;
  @field('remoteId') remoteId;
  @field('isRequiredLocation') isRequiredLocation;
  @field('isRequiredSignature') isRequiredSignature;
  @field('longitude') longitude;
  @field('latitude') latitude;
  @field('lastModificationTime') lastModificationTime;
  @json('signature', sanitizeJson) signature;
  @json('team', sanitizeJson) team;
  @json('teamAssignee', sanitizeJson) teamAssignee;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      sourceId: this.sourceId,
      remoteId: this.remoteId,
      property: this.property,
      signature: this.signature,
      team: this.team,
      isRequiredLocation: this.isRequiredLocation,
      longitude: this.longitude,
      latitude: this.latitude,
      lastModificationTime: this.lastModificationTime,
      isRequiredSignature: this.isRequiredSignature,
      teamAssignee: this.teamAssignee
    };
  }

  /**
   * Delete options
   * Delete images
   * Delete formUserAnswerQuestion
   * */
  // async markAsDeleted() {
  //   // await this.formUserAnswer.markAsDeleted();
  //   // await this.workflow.markAsDeleted();
  //   await super.markAsDeleted();
  // }

  async getDetail() {
    const property = await fetchRelationAllowNull(this.property);
    return {
      ...this.getValue(),
      property: property && property.getValue(),
    };
  }
}
