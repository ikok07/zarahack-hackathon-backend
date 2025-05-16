import {Request, Response} from "express"
import { MyPos } from "../../utils/mypos";

export async function testPaymentHandler(req: Request, res: Response) {
  const data = await MyPos.initiatePayment({
    SID: process.env.MYPOS_STORE_ID!,
    WalletNumber: process.env.MYPOS_WALLET_NUMBER!,
    Amount: 100,
    Currency: "BGN",
    OrderID: "asdgjashgdhagsk",
    URL_OK: "https://imnextgen.bg/ok",
    URL_Cancel: "https://imnextgen.bg/cancel",
    URL_Notify: "https://imnextgen.bg/notify",
    CardTokenRequest: 0,
    KeyIndex: 1,
    CustomerEmail: "contact@imnextgen.bg",
    CustomerFirstNames: "John",
    CustomerFamilyName: "Smith",
    CustomerPhone: "+359885110030",
    CustomerCountry: "BGR",
    CustomerCity: "Nova Zagora",
    CustomerZIPCode: "8900",
    CustomerAddress: "prof. Minko Balkanski 1",
    CartItems: 1,
    Cart: [{
      Article: "Test",
      Quantity: 1,
      Price: 100,
      Currency: "BGN"
    }]
  });

  res.contentType("text/html");
  res.send(Buffer.from(data));
}