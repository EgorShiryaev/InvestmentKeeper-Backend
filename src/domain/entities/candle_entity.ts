type CandleEntity = {
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  volume: number;
  time?: Date;
  isComplete: boolean;
};

export default CandleEntity;
