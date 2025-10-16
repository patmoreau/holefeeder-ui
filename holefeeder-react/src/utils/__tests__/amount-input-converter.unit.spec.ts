import { amountInputConverter } from '@/utils/amount-input-converter';

describe('amount-input-converter', () => {
  it('should convert amount input to number', () => {
    const input = '12345';
    const mockDisplayValue = '123.45';
    const mockValue = 123.45;
    const stubOnDisplayValue = jest.fn();
    const stubOnAmountChanged = jest.fn();

    amountInputConverter(input, stubOnDisplayValue, stubOnAmountChanged);

    expect(stubOnDisplayValue).toHaveBeenCalledWith(mockDisplayValue);
    expect(stubOnAmountChanged).toHaveBeenCalledWith(mockValue);
  });

  it('should convert amount input to number', () => {
    const input = '1a2b3c4d5.99';
    const mockDisplayValue = '12345.99';
    const mockValue = 12345.99;
    const stubOnDisplayValue = jest.fn();
    const stubOnAmountChanged = jest.fn();

    amountInputConverter(input, stubOnDisplayValue, stubOnAmountChanged);

    expect(stubOnDisplayValue).toHaveBeenCalledWith(mockDisplayValue);
    expect(stubOnAmountChanged).toHaveBeenCalledWith(mockValue);
  });

  it('should not convert alpha input to number', () => {
    const input = 'qwerty';
    const mockDisplayValue = '';
    const mockValue = 0;
    const stubOnDisplayValue = jest.fn();
    const stubOnAmountChanged = jest.fn();

    amountInputConverter(input, stubOnDisplayValue, stubOnAmountChanged);

    expect(stubOnDisplayValue).toHaveBeenCalledWith(mockDisplayValue);
    expect(stubOnAmountChanged).toHaveBeenCalledWith(mockValue);
  });
});
