import { MultiSendCallOnlyContract } from '@biconomy-sdk/core-types'
import {
  MultiSendCallOnlyContractV101 as MultiSendCallOnly_TypeChain,
  MultiSendCallOnlyContractV101Interface
} from '../../../../typechain/src/ethers-v5/v1.0.1/MultiSendCallOnlyContractV101'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'

class MultiSendCallOnlyEthersContract implements MultiSendCallOnlyContract {
  constructor(public contract: MultiSendCallOnly_TypeChain) {}

  getAddress(): string {
    return this.contract.address
  }

  getContract(): Contract {
    return this.contract
  }

  getInterface(): Interface {
    return this.contract.interface
  }

  encode: MultiSendCallOnlyContractV101Interface['encodeFunctionData'] = (
    methodName: any,
    params: any
  ): string => {
    return this.contract.interface.encodeFunctionData(methodName, params)
  }
}

export default MultiSendCallOnlyEthersContract
