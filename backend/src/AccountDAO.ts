import pgp from "pg-promise";

export default interface AccountDAO {
    saveAccount (account: any): Promise<void>;
    getAccountById (accountId: string): Promise<any>;
    getAccountAssets (accountId: string): Promise<any>;
    getAccountAsset (accountId: string, assetId: string): Promise<any>;
    updateAccountAsset (quantity: number, accountId: string, assetId: string): Promise<void>;
    saveAccountAsset (input: any): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {

    async saveAccount(account: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
        await connection.$pool.end();
    }

    async getAccountById(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        await connection.$pool.end();
        return accountData;
    }

    async getAccountAssets(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        await connection.$pool.end();
        return accountAssetsData;
    }

    async getAccountAsset (accountId: string, assetId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [accountAssetsData] = await connection.query("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [accountId, assetId]);
        await connection.$pool.end();
        return accountAssetsData;
    }

    async updateAccountAsset (quantity: number, accountId: string, assetId: string): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3", [quantity, accountId, assetId]);
        await connection.$pool.end();
    }

    async saveAccountAsset (input: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [input.accountId, input.assetId, input.quantity]);
        await connection.$pool.end();
    }

}

export class AccountDAOMemory implements AccountDAO {   
    accounts: any = [];
    accountAssets: any = [];

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

    async getAccountById(accountId: string): Promise<any> {
        const account = this.accounts.find((account: any) => account.accountId === accountId);
        return account;
    }

    async getAccountAssets(accountId: string): Promise<any> {
        return [];
    }

    async saveAccountAsset (input: any): Promise<void> {        
        this.accountAssets.push(input);
    }

    async getAccountAsset(accountId: string, assetId: string): Promise<any> {
        const accountAsset = this.accountAssets.find((accountAsset: any) => accountAsset.accountId === accountId && accountAsset.assetId === assetId);
        return accountAsset;
    }

    async updateAccountAsset(quantity: number, accountId: string, assetId: string): Promise<void> {
        const accountAsset = this.accountAssets.find((accountAsset: any) => accountAsset.accountId === accountId && accountAsset.assetId === assetId);
        accountAsset.quantity = quantity;        
    }

}
