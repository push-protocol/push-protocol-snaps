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
Object.defineProperty(exports, "__esModule", { value: true });
const PushAPI = __importStar(require("@pushprotocol/restapi"));
const constants_1 = require("@pushprotocol/restapi/src/lib/constants");
const snapOptIn = (signer, address, channelAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const defaultSnapOrigin = 'npm:@pushprotocol/snap';
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
            channelAddress: `eip155:5:${channelAddress}`,
            userAddress: `eip155:5:${address}`,
            onSuccess: () => {
                console.log("opt in success");
            },
            onError: () => {
                console.error("opt in error");
            },
            env: constants_1.ENV.PROD,
        });
    }
});
exports.default = snapOptIn;
