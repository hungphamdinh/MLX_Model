/**
 * Created by thienmd on 9/25/20
 */
import get from 'lodash/get';
import { getKeyByBundle } from '../Config';

const mockLanguage = {
  BOOKING_TYPE: 'Booking Type',
  OCCUPIER: 'Occupier',
  COMPANY: 'Company',
  OUTSIDER: 'Outsider',
  BOOKING_POLICY_RULE: 'Policy and Booking Rules',
  BOOKING_AMENITY_RULES: 'Rules',
  BOOKING_POLICIES: 'Policies',
  ADD_BOOKING: 'Add Booking',
  BOOKING_DESCRIPTION: 'Booking Description',
  BOOKING_INFO: 'Information',
  PAYMENT_STATUS: 'Payment Status',
  EDIT_BOOKING: 'Edit Booking',
  REQUESTED_BY: 'Requested By',
  AMENITY: 'Amenity',
  BOOKING_RECURRING: 'Booking Recurring',
  CANNOT_BOOKING_ON: 'Cannot booking on',
  REMOVE_BOOKING_CONFIRMATION: 'Are you sure to remove this booking?',
  AMENITY_REMARK: 'Amenity Remark',
  BOOKED_TIME: 'Booked Time',
  DEPOSIT_PRICE: 'Deposit Price',
  RECURRENCE_EVERY_MONTH_VALIDATIOM: 'The value must be from 1 to 3',
  DAY: 'Day',
  RECURRENCE_LAST_DAY: 'Last Day',
  NO_RECURRING_SLOT_AVAILABLE: 'No recurring slot available'
};

class I18n {
  static instance;
  languages = [];
  languageId = 'en';
  languageData = {};
  currentLang = {};

  constructor() {
    if (I18n.instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
  }

  static getInstance() {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return this.instance;
  }

  init(languages, languageId) {
    this.languages = languages;
    this.setLanguageId(languageId);
  }

  genegrateLanguageData() {
    const language = this.languages.find((item) => item.id === this.languageId) || {};
    this.languageData = get(language, 'data', {});
    this.currentLang = language;
  }

  setLanguages(languages) {
    this.languages = languages;
    this.genegrateLanguageData();
  }

  setLanguageId(languageId) {
    this.languageId = languageId;
    this.genegrateLanguageData();
  }

  formatString(result, args) {
    if (args && args.length) {
      args.forEach((arg, index) => {
        result = result.replace(`{${index}}`, arg);
      });
    }

    return result;
  }

  t = (name, fallbackName, ...args) => {
    let result;
    if (this.languageData) {
      result = this.languageData[name];
      if (result) {
        return this.formatString(result, args);
      }
    }
    if (fallbackName) {
      return this.formatString(fallbackName, args);
    }
    // for development purpose
    result = mockLanguage[name];
    if (result) {
      return this.formatString(result, args);
    }
    return this.formatString(name, args);
  };

  whiteLabelTranslate = (name) => {
    const isSI = getKeyByBundle(false, false, false, false, false, false, true, true, true);
    const translation = this.t(name) || '';
    if (isSI) {
      return translation.replace('Property Cube', 'Savills Inspection');
    }
    return translation;
  };
}

export default I18n.getInstance();
