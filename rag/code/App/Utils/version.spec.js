/**
 * Created by thienmd on 9/7/20
 */

const version = require('./version');

test('1.0.0 equal 1.0.0', () => {
  expect(version.compareVersion('1.0.0', '1.0.0')).toBe(0);
});

test('larger', () => {
  expect(version.compareVersion('1.0.1', '1.0.0')).toBe(1);
});

test('smaller', () => {
  expect(version.compareVersion('1.0.0', '1.0.1')).toBe(-1);
});

test('1.0 equal 1.0.0', () => {
  expect(version.compareVersion('1.0', '1.0.0')).toBe(0);
});

test('larger', () => {
  expect(version.compareVersion('1.1.1', '1.0')).toBe(1);
});

test('smaller', () => {
  expect(version.compareVersion('1.1', '1.1.2')).toBe(-1);
});
