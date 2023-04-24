type CreateRefillData = {
  accountId: number;
  value: number;
};

interface RefillsDatasource {
  create: (data: CreateRefillData) => Promise<number>;
}

export default RefillsDatasource;

