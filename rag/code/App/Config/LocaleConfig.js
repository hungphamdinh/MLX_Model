/**
 * Created by thienmd on 8/13/20
 */
import _ from 'lodash';

class LocaleConfig {
  static _instance: LocaleConfig;
  symbol = 'đ';
  precision = 2;
  decimalSeparator = '.';
  groupSeparator = ',';
  isLeading = false;
  allowOnlinePayment = false;
  allowSendEmail = false;
  allowSendEmailToResident = false;
  allowSendSms = false;
  dateTimeFormat = 'DD/MM/YYYY';
  timeFormat = 'HH:mm:ss';
  fullDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';

  constructor() {
    if (LocaleConfig._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
  }

  static getInstance(): LocaleConfig {
    if (!LocaleConfig._instance) {
      LocaleConfig._instance = new LocaleConfig();
    }
    return this._instance;
  }

  init(config) {
    this.symbol = config.currency;
    this.precision = parseInt(config.zeroDigit, 10);
    this.decimalSeparator = config.decimalSeparator;
    this.groupSeparator = config.groupSeparator;
    this.isLeading = config.isSymbolFrontNumber;
    this.allowOnlinePayment = config.allowOnlinePayment;
    this.allowSendEmail = config.allowSendEmail;
    this.allowSendEmailToResident = config.allowSendEmailToResident;
    this.allowSendSms = config.allowSendSms;
    this.dateTimeFormat = _.toUpper(config.dateTimeFormat);
    this.timeFormat = config.timeFormat;
    this.fullDateTimeFormat = `${this.dateTimeFormat} ${this.timeFormat}`;
  }

  getInputOptions = (includeSymbol) => {
    let option = {
      precision: this.precision,
      separator: this.decimalSeparator,
      delimiter: this.groupSeparator,
      unit: '',
      suffix: '',
    };
    if (includeSymbol) {
      option = {
        ...option,
        unit: this.isLeading ? `${this.symbol} ` : '',
        suffix: !this.isLeading ? `${this.symbol}` : '',
      };
    }
    return option;
  };

  formatMoney = (amount, includeCurrencySymbol = true) => {
    try {
      const negativeSign = amount < 0 ? '-' : '';
      const i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(this.precision))).toString();
      const j = i.length > 3 ? i.length % 3 : 0;
      const formattedNumber =
        negativeSign +
        (j ? i.substr(0, j) + this.groupSeparator : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${this.groupSeparator}`) +
        (this.precision
          ? this.decimalSeparator +
            Math.abs(amount - i)
              .toFixed(this.precision)
              .slice(2)
          : '');
      if (includeCurrencySymbol) {
        return this.isLeading ? `${this.symbol} ${formattedNumber}` : `${formattedNumber} ${this.symbol}`;
      }
      return formattedNumber;
    } catch (e) {
      console.log(e);
    }
  };

  formatNumber = (number, precision = this.precision) => {
    const text = `${parseFloat(number).toFixed(precision)}`;
    return text.replace('.', this.decimalSeparator);
  };
}

export default LocaleConfig.getInstance();
