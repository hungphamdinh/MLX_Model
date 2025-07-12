import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';
import { generateInspectionUUID, TableNames } from '../IDGenerator';

export default class BaseModal extends Model {
  @field('remoteId') remoteId;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  useGuid(objectGuid) {
    const guid = objectGuid || generateInspectionUUID(TableNames.formUserAnswerQuestionOption);
    this.remoteId = 0;
    this._raw.id = guid;
    this.guid = guid;
  }
}

export const sanitizeJson = (jsonData) => jsonData;
