import { t } from '@lingui/macro'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  accountRoleAtom,
  addTransactionAtom,
  rTokenStatusAtom,
} from 'state/atoms'
import { RTOKEN_STATUS, TRANSACTION_STATUS } from 'utils/constants'
import SettingItem from './SettingItem'
import useRToken from 'hooks/useRToken'
import { useTransaction } from 'state/web3/hooks/useTransactions'

const PauseManager = () => {
  const rToken = useRToken()
  const accountRole = useAtomValue(accountRoleAtom)
  const { paused: isPaused } = useAtomValue(rTokenStatusAtom)
  const addTransaction = useSetAtom(addTransactionAtom)
  const pauseActionLabel = isPaused ? t`Unpause` : t`Pause`
  const [txId, setTx] = useState('')
  const tx = useTransaction(txId)

  useEffect(() => {
    if (
      tx?.status === TRANSACTION_STATUS.CONFIRMED ||
      tx?.status === TRANSACTION_STATUS.REJECTED
    ) {
      setTx('')
    }
  }, [tx?.status])

  const handlePause = () => {
    if (rToken?.main) {
      const id = uuid()
      setTx(id)
      addTransaction([
        {
          id,
          description: isPaused
            ? t`Unpause ${rToken?.symbol}`
            : t`Pause ${rToken?.symbol}`,
          status: TRANSACTION_STATUS.PENDING,
          value: '0',
          call: {
            abi: 'main',
            address: rToken?.main || '',
            method: isPaused ? 'unpause' : 'pause',
            args: [],
          },
        },
      ])
    }
  }

  return (
    <>
      <SettingItem
        title={isPaused ? t`RToken is paused` : t`RToken is not paused`}
        subtitle={t`Current status:`}
        value={isPaused ? t`Paused` : t`Unpaused`}
        icon="danger"
        mb={3}
      />
      <SettingItem
        title="RToken pauser"
        subtitle={t`Role held by:`}
        value="0xfb...0344"
        action={accountRole.pauser || accountRole.owner ? pauseActionLabel : ''}
        onAction={handlePause}
        loading={!!txId}
        actionVariant="danger"
      />
    </>
  )
}

export default PauseManager
