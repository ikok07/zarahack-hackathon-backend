import { Router } from "express";
import { catchErrors } from "../../../utils/catch-errors";
import { testPaymentHandler } from "../../../handlers/payments/test-payment.handler";

const paymentsRoutes = Router();

paymentsRoutes.get("/test", catchErrors(testPaymentHandler))

export default paymentsRoutes;