import { CategoryType, normalizeCategoryType } from '@/shared/core/category-type';

describe('CategoryType', () => {
  describe('normalizeCategoryType', () => {
    it('should normalize lowercase "expense" to CategoryType.expense', () => {
      const result = normalizeCategoryType('expense');
      expect(result).toBe(CategoryType.expense);
    });

    it('should normalize uppercase "EXPENSE" to CategoryType.expense', () => {
      const result = normalizeCategoryType('EXPENSE');
      expect(result).toBe(CategoryType.expense);
    });

    it('should normalize mixed case "Expense" to CategoryType.expense', () => {
      const result = normalizeCategoryType('Expense');
      expect(result).toBe(CategoryType.expense);
    });

    it('should normalize lowercase "gain" to CategoryType.gain', () => {
      const result = normalizeCategoryType('gain');
      expect(result).toBe(CategoryType.gain);
    });

    it('should normalize uppercase "GAIN" to CategoryType.gain', () => {
      const result = normalizeCategoryType('GAIN');
      expect(result).toBe(CategoryType.gain);
    });

    it('should normalize mixed case "Gain" to CategoryType.gain', () => {
      const result = normalizeCategoryType('Gain');
      expect(result).toBe(CategoryType.gain);
    });

    it('should default to expense for unknown types and log a warning', () => {
      const result = normalizeCategoryType('unknown');
      expect(result).toBe(CategoryType.expense);
    });

    it('should handle empty string by defaulting to expense', () => {
      const result = normalizeCategoryType('');
      expect(result).toBe(CategoryType.expense);
    });

    it('should handle whitespace variations', () => {
      expect(normalizeCategoryType('  expense  ')).toBe(CategoryType.expense);
      expect(normalizeCategoryType('  GAIN  ')).toBe(CategoryType.gain);
    });
  });
});
