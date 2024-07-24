import { NumberConversionHelper } from './number-conversion.helper';

export class InterestHelper {
  private numberConversionHelper;

  constructor() {
    this.numberConversionHelper = new NumberConversionHelper();
  }

  getFinalAmount(principal: number, roi: number, days: number): number {
    const interest = (principal * roi * days) / (365 * 100);
    const amount = principal + interest;

    return this.numberConversionHelper.getTwoDecimalNumber(amount);
  }
}
