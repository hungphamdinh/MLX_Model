import { numberWithGroupSeparator } from '../converNumber'; // Replace 'your-module' with the correct import path

describe('numberWithGroupSeparator', () => {
  it('input Both Decimal and Integer part', () => {
    expect(numberWithGroupSeparator(1234567.89, 2)).toEqual('1,234,567.89');
    expect(numberWithGroupSeparator(1234567.891234, 4)).toEqual('1,234,567.8912');
    expect(numberWithGroupSeparator(1234567, 0)).toEqual('1,234,567');
    expect(numberWithGroupSeparator(1234567)).toEqual('1,234,567');
  });
  it('input only Integer part', () => {
    expect(numberWithGroupSeparator(1234567, 2)).toEqual('1,234,567.00');
    expect(numberWithGroupSeparator(1234567, 0)).toEqual('1,234,567');
  });
});
