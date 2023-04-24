type CreateWithdrawalData = {
  accountId: number;
  value: number;
};

interface WithdrawalsDatasource {
  create: (data: CreateWithdrawalData) => Promise<number>;
}

export default WithdrawalsDatasource;

