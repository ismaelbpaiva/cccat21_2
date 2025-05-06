import AccountDAO from "./AccountDAO";

export default class Deposit {
    constructor(readonly accountDAO: AccountDAO){}

    async execute(input: any){
        await this.accountDAO.saveAccountAsset(input);
    }
}