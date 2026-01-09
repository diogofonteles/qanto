import { CnpjValidator } from './cnpj.validator';

describe('CnpjValidator', () => {
  describe('validate', () => {
    it('should validate a correct CNPJ', () => {
      const validCnpj = '11.222.333/0001-81';
      expect(CnpjValidator.validate(validCnpj)).toBe(true);
    });

    it('should validate CNPJ without formatting', () => {
      const validCnpj = '11222333000181';
      expect(CnpjValidator.validate(validCnpj)).toBe(true);
    });

    it('should reject CNPJ with wrong length', () => {
      const invalidCnpj = '11222333000';
      expect(CnpjValidator.validate(invalidCnpj)).toBe(false);
    });

    it('should reject CNPJ with all same digits', () => {
      const invalidCnpj = '11111111111111';
      expect(CnpjValidator.validate(invalidCnpj)).toBe(false);
    });

    it('should reject CNPJ with invalid check digits', () => {
      const invalidCnpj = '11.222.333/0001-99';
      expect(CnpjValidator.validate(invalidCnpj)).toBe(false);
    });

    it('should handle empty string', () => {
      expect(CnpjValidator.validate('')).toBe(false);
    });

    it('should handle null or undefined', () => {
      expect(CnpjValidator.validate(null as any)).toBe(false);
      expect(CnpjValidator.validate(undefined as any)).toBe(false);
    });
  });

  describe('format', () => {
    it('should format a valid CNPJ', () => {
      const cnpj = '11222333000181';
      const formatted = CnpjValidator.format(cnpj);
      expect(formatted).toBe('11.222.333/0001-81');
    });

    it('should return formatted CNPJ as is', () => {
      const cnpj = '11.222.333/0001-81';
      const formatted = CnpjValidator.format(cnpj);
      expect(formatted).toBe('11.222.333/0001-81');
    });

    it('should handle CNPJ with partial formatting', () => {
      const cnpj = '11222333/0001-81';
      const formatted = CnpjValidator.format(cnpj);
      expect(formatted).toBe('11.222.333/0001-81');
    });
  });
});
