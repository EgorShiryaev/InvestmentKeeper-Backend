import BaseEntity from './base_entity';

type WithdrawalEntity = BaseEntity & {
  date: string;
  value: number;
};

export default WithdrawalEntity;

