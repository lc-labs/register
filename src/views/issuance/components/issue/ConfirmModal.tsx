import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseEther } from '@ethersproject/units'
import { ERC20Interface, RSVManagerInterface, RTokenInterface } from 'abis'
import { Button, NumericalInput } from 'components'
import Modal from 'components/modal'
import useBlockNumber from 'hooks/useBlockNumber'
import { useRTokenContract } from 'hooks/useContract'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { addTransactionAtom, allowanceAtom } from 'state/atoms'
import { Divider, Text } from 'theme-ui'
import { BigNumberMap, ReserveToken, TransactionState } from 'types'
import { formatCurrency, hasAllowance } from 'utils'
import { TRANSACTION_STATUS } from 'utils/constants'
import { issueAmountAtom, quantitiesAtom } from 'views/issuance/atoms'
import IssuanceApprovals from './modal/Approvals'
import CollateralDistribution from './modal/CollateralDistribution'

interface Props {
  data: ReserveToken
  issuableAmount: number
  onClose: () => void
}

/**
 * Build issuance required transactions
 *
 * @param data <ReserveToken>
 * @param amount <string>
 * @param quantities <BigNumber[]>
 * @returns TransactionState[]
 */
const buildApprovalTransactions = (
  data: ReserveToken,
  quantities: BigNumberMap,
  allowances: BigNumberMap
): TransactionState[] => {
  const tokenQuantities: [string, BigNumber][] = []

  // Create token approvals calls array
  const transactions: TransactionState[] = data.basket.collaterals.map(
    ({ token }) => {
      // Specific token approvals
      const tokenAmount = quantities[getAddress(token.address)]
      // Unlimited approval
      // const tokenAmount = BigNumber.from(Number.MAX_SAFE_INTEGER)
      const description = `Approve ${formatUnits(
        tokenAmount,
        token.decimals
      )} ${token.symbol}`

      // Fill token quantities on the same map
      tokenQuantities.push([token.address, tokenAmount])

      return {
        description,
        status: allowances[getAddress(token.address)].gte(tokenAmount)
          ? TRANSACTION_STATUS.SKIPPED
          : TRANSACTION_STATUS.PENDING,
        value: formatUnits(tokenAmount, token.decimals),
        call: {
          abi: ERC20Interface,
          address: token.address,
          method: 'approve',
          args: [data.isRSV ? data.id : data.token.address, tokenAmount],
        },
      }
    }
  )

  return transactions
}

const ConfirmModal = ({ data, issuableAmount, onClose }: Props) => {
  const [amount, setAmount] = useAtom(issueAmountAtom)
  const quantities = useAtomValue(quantitiesAtom)
  const addTransaction = useSetAtom(addTransactionAtom)
  const allowances = useAtomValue(allowanceAtom)
  const contract = useRTokenContract(data.token.address, true)!
  const [signing, setSigning] = useState(false)
  const [approvalsTx, setApprovalsTx] = useState([] as TransactionState[])
  const [gasEstimates, setGasEstimates] = useState([] as BigNumber[])
  const approvalsNeeded = useMemo(
    () => approvalsTx.some((tx) => tx.status === TRANSACTION_STATUS.PENDING),
    [approvalsTx]
  )
  const canIssue = useMemo(
    () => hasAllowance(allowances, quantities),
    [allowances, quantities]
  )

  const isValid = () => {
    const _value = Number(amount)
    return _value > 0 && _value <= issuableAmount && canIssue
  }

  const handleIssue = async () => {
    if (signing) return

    setSigning(true)
    try {
      const issueAmount = parseEther(amount)

      if (!data.isRSV) {
        await contract.callStatic.issue(issueAmount)
      }

      addTransaction([
        {
          description: `Issue ${amount} ${data.token.symbol}`,
          status: TRANSACTION_STATUS.PENDING,
          value: amount,
          call: {
            abi: data.isRSV ? RSVManagerInterface : RTokenInterface,
            address: data.isRSV ? data.id : data.token.address,
            method: 'issue',
            args: [issueAmount],
          },
        },
      ])
    } catch (e) {
      // TODO: Handle error case
      console.log('error issuing')
    }
    setSigning(false)
  }

  useEffect(() => {
    if (Object.keys(allowances).length && Object.keys(quantities).length) {
      setApprovalsTx(buildApprovalTransactions(data, quantities, allowances))
    } else {
      setApprovalsTx([])
    }
  }, [allowances, quantities])

  return (
    <Modal
      title="Confirm Issuance"
      onClose={onClose}
      style={{ width: '400px' }}
    >
      <NumericalInput
        id="mint"
        placeholder="Mint amount"
        value={amount}
        onChange={setAmount}
      />
      <CollateralDistribution mt={3} data={data} quantities={quantities} />
      {approvalsNeeded && !canIssue && (
        <IssuanceApprovals symbol={data.token.symbol} txs={approvalsTx} />
      )}
      <Divider mx={-3} mt={3} sx={{ borderColor: '#ccc' }} />
      <Button
        sx={{ width: '100%' }}
        disabled={!isValid()}
        mt={2}
        onClick={handleIssue}
      >
        {signing ? (
          <Text></Text>
        ) : (
          <Text>
            Begin minting {formatCurrency(Number(amount))} {data.token.symbol}
          </Text>
        )}
      </Button>
    </Modal>
  )
}

export default ConfirmModal