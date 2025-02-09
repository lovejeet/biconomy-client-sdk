import {
    BigNumber,
    BigNumberish,
    Contract,
    utils
} from 'ethers'

import { IMetaTransaction, IWalletTransaction, Transaction } from '@biconomy-sdk/core-types'

import { AddressZero } from '@ethersproject/constants'

export class Utils {

    constructor() {

    }

    buildSmartAccountTransaction = (template: {
        to: string
        value?: BigNumberish
        data?: string
        operation?: number
        targetTxGas?: number | string
        baseGas?: number | string
        gasPrice?: number | string
        tokenGasPriceFactor?: number | string
        gasToken?: string
        refundReceiver?: string
        nonce: number
    }): IWalletTransaction => {
        return {
            to: template.to,
            value: template.value || 0,
            data: template.data || '0x',
            operation: template.operation || 0,
            targetTxGas: template.targetTxGas || 0,
            baseGas: template.baseGas || 0,
            gasPrice: template.gasPrice || 0,
            tokenGasPriceFactor: template.tokenGasPriceFactor || 1,
            gasToken: template.gasToken || AddressZero,
            refundReceiver: template.refundReceiver || AddressZero,
            nonce: template.nonce
        }
    }

    buildSmartAccountTransactions = (transactions: Transaction[]):IMetaTransaction[] => {
        const txs: IMetaTransaction[] = []
        for (let i = 0; i < transactions.length; i++) {
            const innerTx: IWalletTransaction = this.buildSmartAccountTransaction({
              to: transactions[i].to,
              value: transactions[i].value,
              data: transactions[i].data, // for token transfers use encodeTransfer
              nonce: 0
            })
      
            txs.push(innerTx)
          }
        return txs
    }

    buildMultiSendSmartAccountTx = (
        multiSend: Contract,
        txs: IMetaTransaction[],
        nonce: number,
        overrides?: Partial<IWalletTransaction>
    ): IWalletTransaction => {
        return this.buildContractCall(multiSend, 'multiSend', [this.encodeMultiSend(txs)], nonce, true, overrides)
    }

    encodeMultiSend = (txs: IMetaTransaction[]): string => {
        return '0x' + txs.map((tx) => this.encodeMetaTransaction(tx)).join('')
    }

    encodeMetaTransaction = (tx: IMetaTransaction): string => {
        const data = utils.arrayify(tx.data)
        const encoded = utils.solidityPack(
            ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
            [tx.operation, tx.to, tx.value, data.length, data]
        )
        return encoded.slice(2)
    }

    buildContractCall = (
        contract: Contract,
        method: string,
        params: any[],
        nonce: number,
        delegateCall?: boolean,
        overrides?: Partial<IWalletTransaction>
      ): IWalletTransaction => {
        const data = contract.interface.encodeFunctionData(method, params)
        return this.buildSmartAccountTransaction(
          Object.assign(
            {
              to: contract.address,
              data,
              operation: delegateCall ? 1 : 0,
              nonce
            },
            overrides
          )
        )
      }


}