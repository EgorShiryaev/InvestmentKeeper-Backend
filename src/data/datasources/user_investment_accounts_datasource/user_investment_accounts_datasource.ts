import InvestmentAccountModel from '../../models/investment_account/investment_account';

type UserInvestmentAccountsDatasource = {
    getAll: (userId: number) => Promise<InvestmentAccountModel[]>;
};

export default UserInvestmentAccountsDatasource;
