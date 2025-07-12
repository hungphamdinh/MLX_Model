import ConvertObjectToQueryString from './ConvertObjectToQueryString'; // Adjust the import path as needed

describe('ConvertObjectToQueryString', () => {
  // Basic functionality tests
  describe('Default behavior (with encoding)', () => {
    test('should encode simple key-value pairs', () => {
      const input = { name: 'John Doe', age: 30 };
      expect(ConvertObjectToQueryString(input)).toBe('name=John%20Doe&age=30');
    });

    test('should handle special characters', () => {
      const input = { query: 'hello world!', category: 'tech & gadgets' };
      expect(ConvertObjectToQueryString(input)).toBe('query=hello%20world!&category=tech%20%26%20gadgets');
    });
  });

  // Array handling tests
  describe('Array handling', () => {
    test('should handle array values', () => {
      const input = { tags: ['react', 'native'] };
      expect(ConvertObjectToQueryString(input)).toBe('tags=react&tags=native');
    });

    test('should encode array values', () => {
      const input = { tags: ['react native', 'mobile dev'] };
      expect(ConvertObjectToQueryString(input)).toBe('tags=react%20native&tags=mobile%20dev');
    });
  });

  // Null and undefined handling tests
  describe('Null and undefined handling', () => {
    test('should remove undefined values by default', () => {
      const input = { name: 'John', age: undefined, city: 'New York' };
      expect(ConvertObjectToQueryString(input)).toBe('name=John&city=New%20York');
    });

    test('should remove null values when isRemoveNull is true', () => {
      const input = { name: 'John', age: null, city: 'New York' };
      expect(ConvertObjectToQueryString(input)).toBe('name=John&city=New%20York');
    });

    test('should keep null values when isRemoveNull is false', () => {
      const input = { name: 'John', age: null, city: 'New York' };
      expect(ConvertObjectToQueryString(input, false)).toBe('name=John&age=null&city=New%20York');
    });
  });

  // Skip encoding tests
  describe('Skip URL encoding', () => {
    test('should skip encoding when skipEncodeUri is true', () => {
      const input = { name: 'John Doe', age: 30 };
      expect(ConvertObjectToQueryString(input, true, true)).toBe('name=John Doe&age=30');
    });

    test('should skip encoding for special characters when skipEncodeUri is true', () => {
      const input = { query: 'hello world!', category: 'tech & gadgets' };
      expect(ConvertObjectToQueryString(input, true, true)).toBe('query=hello world!&category=tech & gadgets');
    });

    test('should work with arrays when skipEncodeUri is true', () => {
      const input = { tags: ['react native', 'mobile dev'] };
      expect(ConvertObjectToQueryString(input, true, true)).toBe('tags=react native&tags=mobile dev');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    test('should return empty string for empty object', () => {
      expect(ConvertObjectToQueryString({})).toBe('');
    });

    test('should handle boolean values', () => {
      const input = { isActive: true, isAdmin: false };
      expect(ConvertObjectToQueryString(input)).toBe('isActive=true&isAdmin=false');
    });

    test('should handle numeric values', () => {
      const input = { id: 42, price: 19.99 };
      expect(ConvertObjectToQueryString(input)).toBe('id=42&price=19.99');
    });
  });
});
