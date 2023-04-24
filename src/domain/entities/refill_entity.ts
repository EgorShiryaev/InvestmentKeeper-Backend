import BaseEntity from './base_entity';

type RefillEntity = BaseEntity & {
  date: string;
  value: number;
};

export default RefillEntity;

