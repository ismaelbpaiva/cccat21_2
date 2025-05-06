import { AccountDAODatabase } from "../../src/AccountDAO";
import GetOrder from "../../src/GetOrder";
import { OrderDAODatabase } from "../../src/OrderDAO";
import PlaceOrder from "../../src/PlaceOrder";
import Signup from "../../src/Signup";

const accountDAO = new AccountDAODatabase();
const orderDAO = new OrderDAODatabase();
const signup = new Signup(accountDAO);
const placeOrder = new PlaceOrder(orderDAO);
const getOrder = new GetOrder(orderDAO);


test("Deve criar uma ordem de venda", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrder = {
        marketId: "BTC/USD",
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
    expect(outputPlaceOrder.orderId).toBeDefined();
    const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
    expect(outputGetOrder.marketId).toBe(inputPlaceOrder.marketId);
    expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
    expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
    expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
    expect(outputGetOrder.status).toBe("open");
    expect(outputGetOrder.timestamp).toBeDefined();
});
