import MoneyEntity from '../../domain/entities/money_entity';

type CandleModel = {
  /** Цена открытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  open?: MoneyEntity;
  /** Максимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  high?: MoneyEntity;
  /** Минимальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  low?: MoneyEntity;
  /** Цена закрытия за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента. */
  close?: MoneyEntity;
  /** Объём торгов в лотах. */
  volume: number;
  /** Время свечи в часовом поясе UTC. */
  time?: Date;
  /** Признак завершённости свечи. **false** значит, свеча за текущие интервал ещё сформирована не полностью. */
  isComplete: boolean;
};

export default CandleModel;

