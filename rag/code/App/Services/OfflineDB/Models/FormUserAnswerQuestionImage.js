import { field, json, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';
import { generateInspectionUUID, TableNames } from '../IDGenerator';

export default class FormUserAnswerQuestionImage extends BaseModel {
  static table = 'formUserAnswerQuestionImage';

  static associations = {
    formUserAnswerQuestion: {
      type: 'belongs_to',
      key: 'formUserAnswerQuestionGuid',
    },
    workflow: {
      type: 'belongs_to',
      key: 'workflowGuid',
    },
  };

  @relation('formUserAnswerQuestion', 'formUserAnswerQuestionGuid') formUserAnswerQuestion;
  @relation('workflow', 'workflowGuid') workflow;

  @field('guid') guid;
  @field('formUserAnswerQuestionGuid') formUserAnswerQuestionGuid;
  @field('formUserAnswerQuestionId') formUserAnswerQuestionId;
  @field('workflowGuid') workflowGuid;
  @field('imageGuid') imageGuid;
  @field('path') path;
  @field('description') description;
  @field('remoteId') remoteId;
  @json('files', sanitizeJson) files;
  @field('longitude') longitude;
  @field('latitude') latitude;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      formUserAnswerQuestionGuid: this.formUserAnswerQuestionGuid,
      formUserAnswerQuestionId: this.formUserAnswerQuestionId,
      imageGuid: this.imageGuid,
      path: this.path,
      files: this.files,
      remoteId: this.remoteId,
      workflowGuid: this.workflowGuid,
      description: this.description,
      longitude: this.longitude,
      latitude: this.latitude,
    };
  }
}
