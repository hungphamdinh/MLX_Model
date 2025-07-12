import { convertHEICFile } from '../file';

describe('convertHEICFile', () => {
  test('should replace heic with jpeg', () => {
    expect(convertHEICFile('image.heic')).toBe('image.jpeg');
  });

  test('should replace HEIC with jpeg', () => {
    expect(convertHEICFile('photo.HEIC')).toBe('photo.jpeg');
  });

  test('should replace heif with jpeg', () => {
    expect(convertHEICFile('graphic.heif')).toBe('graphic.jpeg');
  });

  test('should replace HEIF with jpeg', () => {
    expect(convertHEICFile('snapshot.HEIF')).toBe('snapshot.jpeg');
  });

  test('should handle concatenated extensions from Samsung devices', () => {
    expect(convertHEICFile('graphic.heic.heif')).toBe('graphic.jpeg');
  });

  test('should return the same file name if no HEIC or HEIF present', () => {
    expect(convertHEICFile('document.pdf')).toBe('document.pdf');
  });

  test('should handle null or undefined inputs gracefully', () => {
    expect(convertHEICFile(null)).toBe(null);
    expect(convertHEICFile(undefined)).toBe(undefined);
  });
});
