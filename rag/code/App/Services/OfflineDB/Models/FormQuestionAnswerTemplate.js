import { field } from "@nozbe/watermelondb/decorators";
import BaseModel from "./BaseModel";

export default class FormQuestionAnswerTemplate extends BaseModel {
  static table = 'formQuestionAnswerTemplate';

  @field('guid') guid;
  @field('group_code') groupCode;
  @field('icon') icon;
  @field('colorCode') colorCode;
  @field('description') description;
  @field('remote_id') remoteId;

  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      groupCode: this.groupCode,
      description: this.description,
      remoteId: this.remoteId,
    };
  }
}
