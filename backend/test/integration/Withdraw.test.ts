import { AccountDAODatabase } from "../../src/AccountDAO";
import Deposit from "../../src/Deposit";
import GetAccount from "../../src/GetAccount";
import Signup from "../../src/Signup";
import Withdraw from "../../src/Withdraw";

const accountDAO = new AccountDAODatabase();
const deposit = new Deposit(accountDAO);
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);
const withdraw = new Withdraw(accountDAO);


test("Deve fazer um saque", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 5
    }
    await withdraw.execute(inputWithdraw);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);    
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(5);
});

test("Não deve fazer um saque sem fundos", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 5
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow('Insufficient funds');    
});
