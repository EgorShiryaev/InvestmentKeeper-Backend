import MoneyEntity from './money_entity';

type CandleEntity = {
  open?: MoneyEntity;
  close?: MoneyEntity;
  high?: MoneyEntity;
  low?: MoneyEntity;
  volume: number;
  time?: Date;
  isComplete: boolean;
};

export default CandleEntity;
