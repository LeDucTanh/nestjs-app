export class NumberHelper {
  static generateAccountNumber(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
  }
}
