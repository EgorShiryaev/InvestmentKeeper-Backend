type CreateWithdrawalData = {
  accountId: number;
  value: number;
  date?: string;
};

interface WithdrawalsDatasource {
  create: (data: CreateWithdrawalData) => Promise<number>;
}

export default WithdrawalsDatasource;

