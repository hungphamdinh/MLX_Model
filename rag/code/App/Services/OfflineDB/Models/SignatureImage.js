import { field, json, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class SignatureImage extends BaseModel {
  static table = 'signatureImage';

  static associations = {
    workflow: {
      type: 'belongs_to',
      key: 'workflowGuid',
    },

  };

  @relation('workflow', 'workflowGuid') workflow;
  @field('guid') guid;
  @field('workflowGuid') workflowGuid;
  @field('name') name;
  @field('path') path;
  @field('remoteId') remoteId;
  @field('description') description;
  @field('fileName') fileName;
  @field('fileUrl') fileUrl;
  @field('title') title;
  @field('referenceId') referenceId;
  @field('moduleName') moduleName;
  @json('files', sanitizeJson) files;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      path: this.path,
      files: this.files,
      description: this.description,
      name: this.name,
      workflowGuid: this.workflowGuid,
      fileName: this.fileName,
      fileUrl: this.fileUrl,
      title: this.title,
      referenceId: this.referenceId,
      moduleName: this.moduleName
    };
  }
}
