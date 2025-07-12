import { field, relation } from '@nozbe/watermelondb/decorators';
import BaseModel from './BaseModel';

export default class Workflow extends BaseModel {
  static table = 'workflow';
  static associations = {
    inspection: {
      type: 'belongs_to',
      foreignKey: 'parentGuid',
    },
    status: { type: 'belongs_to', foreignKey: 'statusId' },
    form: { type: 'belongs_to', foreignKey: 'formGuid' },
  };
  @relation('inspection', 'parentGuid') inspection;
  @relation('form', 'formGuid') form;
  @relation('status', 'statusId') status;

  @field('guid') guid;
  @field('statusId') statusId;
  @field('trackerId') trackerId;
  @field('roleId') roleId;
  @field('assignedId') assignedId;
  @field('priorityId') priorityId;
  @field('parentId') parentId;
  @field('parentGuid') parentGuid;
  @field('formGuid') formGuid;
  @field('formId') formId;
  @field('subject') subject;
  @field('description') description;
  @field('dueDate') dueDate;
  @field('startDate') startDate;
  @field('closedDate') closedDate;
  @field('remoteId') remoteId;
  @field('rescheduleDate') rescheduleDate;
  @field('rescheduleRemark') rescheduleRemark;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      statusId: this.statusId,
      trackerId: this.trackerId,
      roleId: this.roleId,
      assignedId: this.assignedId,
      priorityId: this.priorityId,
      parentId: this.parentId,
      parentGuid: this.parentGuid,
      formGuid: this.formGuid,
      formId: this.formId,
      subject: this.subject,
      description: this.description,
      dueDate: this.dueDate,
      startDate: this.startDate,
      closedDate: this.closedDate,
      remoteId: this.remoteId,
      inspection: this.inspection,
      rescheduleRemark: this.rescheduleRemark,
      rescheduleDate: this.rescheduleDate
    };
  }

  async getDetail() {
    // const form = await this.form;
    const formDetail = await this.form.getDetail();
    return {
      ...this.getValue(),
      form: formDetail,
    };
  }
}
