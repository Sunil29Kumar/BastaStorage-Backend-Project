import express from "express";
import { createSubscription } from "../controllers/subscriptionController.js";

const route = express.Router();

route.post("/", createSubscription)



export default route;