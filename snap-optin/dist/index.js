"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PushAPI = __importStar(require("@pushprotocol/restapi"));
const constants_1 = require("@pushprotocol/restapi/src/lib/constants");
const axios_1 = __importDefault(require("axios"));
const snapOptIn = (signer, address, channelAddress, chainid) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const defaultSnapOrigin = 'local:http://localhost:8080';
    const res = yield ((_a = window.ethereum) === null || _a === void 0 ? void 0 : _a.request({
        method: "wallet_invokeSnap",
        params: {
            snapId: defaultSnapOrigin,
            request: { method: "pushproto_optin", params: {
                    channelAddress: channelAddress
                } },
        },
    }));
    if (res) {
        yield PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: `eip155:${chainid}:${channelAddress}`,
            userAddress: `eip155:${chainid}:${address}`,
            onSuccess: () => {
                console.log("opt in success");
            },
            onError: () => {
                console.error("opt in error");
            },
            env: constants_1.ENV.PROD,
        });
        let subscribed = yield axios_1.default.get(`https://backend-staging.epns.io/apis/v1/users/eip155:${chainid}:${address}/subscriptions`);
        subscribed = subscribed.data.subscriptions;
        if (subscribed.length == 1) {
            yield ((_b = window.ethereum) === null || _b === void 0 ? void 0 : _b.request({
                method: "wallet_invokeSnap",
                params: {
                    snapId: defaultSnapOrigin,
                    request: { method: "pushproto_firstchanneloptin" },
                },
            }));
        }
    }
});
exports.default = snapOptIn;
