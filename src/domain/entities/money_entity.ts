type MoneyEntity = {
  /** целая часть суммы, может быть отрицательным числом */
  units: number;
  /** дробная часть суммы, может быть отрицательным числом */
  /// 1 / 1000000000
  nano: number;
};

export default MoneyEntity;

export const NANO_VALUE = 1000000000;