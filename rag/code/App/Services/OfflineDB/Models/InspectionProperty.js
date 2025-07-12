import { field, json, children, relation } from '@nozbe/watermelondb/decorators';
import BaseModel, { sanitizeJson } from './BaseModel';

export default class InspectionProperty extends BaseModel {
  static table = 'inspectionProperty';


  @field('guid') guid;
  @field('address') address;
  @field('floor') floor;
  @field('building') building;
  @field('district') district;
  @field('city') city;
  @field('postalCode') postalCode;
  @field('unitNumber') unitNumber;
  @field('notes') notes;
  @field('isActive') isActive;
  @json('propertyType', sanitizeJson) propertyType;
  @json('users', sanitizeJson) users;
  @field('creationTime') creationTime;
  @field('lastModificationTime') lastModificationTime;
  @json('image', sanitizeJson) image;
  @field('name') name;
  @field('remoteId') remoteId;


  getValue() {
    return {
      id: this.id,
      guid: this.guid,
      address: this.address,
      floor: this.floor,
      building: this.building,
      district: this.district,
      city: this.city,
      postalCode: this.postalCode,
      unitNumber: this.unitNumber,
      notes: this.notes,
      isActive: this.isActive,
      propertyType: this.propertyType,
      users: this.users,
      creationTime: this.creationTime,
      lastModificationTime: this.lastModificationTime,
      image: this.image,
      name: this.name,
      remoteId: this.remoteId,


    };
  }
}
