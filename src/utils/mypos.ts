import axios from "axios";
import { InitiatePaymentOptions } from "../models/payments/initiate-payment";
import crypto from "crypto";

export class MyPos {
  static baseUrl = process.env.MYPOS_BASE_URL!
  static ipcVersion = "1.4";
  static language = "BG";

  private static generateSignature(opts: Record<string, string | number>) {
    const concatString = Object.values(opts).join("-");

    const base64Data = Buffer.from(concatString).toString("base64");

    const sign = crypto.createSign("SHA256");
    sign.update(base64Data);
    sign.end();

    return sign.sign(process.env.MYPOS_PRIVATE_KEY!, "base64");
  }

  static async initiatePayment(opts: InitiatePaymentOptions): Promise<string> {
    const formData = new FormData();

    const { Cart, ...cartRemovedOptions } = opts;

    let formattedObject: Record<string, string | number> = {
      IPCmethod: "IPCPurchase",
      IPCLanguage: this.language,
      IPCVersion: this.ipcVersion,
      PaymentParametersRequired: 1,
      ...cartRemovedOptions,
    };

    for (let i = 0; i < Cart.length; i++) {
      formattedObject = {
        ...formattedObject,
        [`Article_${i + 1}`]: Cart[i].Article,
        [`Quantity_${i + 1}`]: Cart[i].Quantity,
        [`Price_${i + 1}`]: Cart[i].Price,
        [`Amount_${i + 1}`]: Cart[i].Quantity * Cart[i].Price,
        [`Currency_${i + 1}`]: Cart[i].Currency,
      }
    }

    Object.entries(formattedObject).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    formData.append("Signature", MyPos.generateSignature(formattedObject));
    console.log(Array.from(formData.entries()));

    const {data} = await axios.post<string>(this.baseUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return data;
  }
}