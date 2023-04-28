type CreateRefillData = {
  accountId: number;
  value: number;
  date?: string;
};

interface RefillsDatasource {
  create: (data: CreateRefillData) => Promise<number>;
}

export default RefillsDatasource;

