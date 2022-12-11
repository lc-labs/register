/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Zapper, ZapperInterface } from "../Zapper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_zapRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "UIntOutOfBounds",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "zapIn",
    outputs: [
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "zapOut",
    outputs: [
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "zapRouter",
    outputs: [
      {
        internalType: "contract IZapRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class Zapper__factory {
  static readonly abi = _abi;
  static createInterface(): ZapperInterface {
    return new utils.Interface(_abi) as ZapperInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Zapper {
    return new Contract(address, _abi, signerOrProvider) as Zapper;
  }
}