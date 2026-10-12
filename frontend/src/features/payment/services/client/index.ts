import * as realApi from "./real";
import * as mockApi from "./mock";
import {env} from "@/shared/client";



const api = env.NEXT_PUBLIC_USE_MOCK ? mockApi : realApi;
export const {getTransaction, getTransactions, getSubscriptionPlans, getActiveSubscription} = api