import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { OracleInterface, StRSRInterface } from 'abis'
import { Facade } from 'abis/types'
import { formatUnits } from 'ethers/lib/utils'
import useBlockNumber from 'hooks/useBlockNumber'
import { useContractCall } from 'hooks/useCall'
import { useFacadeContract } from 'hooks/useContract'
import useRTokenPrice from 'hooks/useRTokenPrice'
import useTokensAllowance from 'hooks/useTokensAllowance'
import useTokensBalance from 'hooks/useTokensBalance'
import { useSetAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useEffect } from 'react'
import {
  allowanceAtom,
  balancesAtom,
  chainIdAtom,
  ethPriceAtom,
  gasPriceAtom,
  pendingIssuancesAtom,
  pendingRSRAtom,
  rsrExchangeRateAtom,
  rsrPriceAtom,
  rTokenAtom,
  rTokenPriceAtom,
  walletAtom,
  zapTokensAllowanceAtom,
  zapTokensAtom,
} from 'state/atoms'
import { ReserveToken, StringMap, Token } from 'types'
import {
  ORACLE_ADDRESS,
  RSR_ADDRESS,
  RSV_ADDRESS,
  WETH_ADDRESS,
  ZAPPER_CONTRACT,
} from 'utils/addresses'
import { CHAIN_ID } from 'utils/chains'
import { RSR } from 'utils/constants'
import { RSV_MANAGER } from 'utils/rsv'
import AccountUpdater from './AccountUpdater'
import RSVUpdater from './RSVUpdater'
import TokenUpdater from './TokenUpdater'
import { promiseMulticall } from './web3/lib/multicall'

// Gets ReserveToken related token addresses and decimals
const getTokens = (
  reserveToken: ReserveToken,
  zapTokens: Token[]
): [string, number][] => {
  const addresses: [string, number][] = [
    [reserveToken.address, reserveToken.decimals],
    [RSR.address, RSR.decimals],
    ...[...reserveToken.collaterals, ...zapTokens].map(
      (token): [string, number] => [token.address, token.decimals]
    ),
  ]

  if (reserveToken.stToken) {
    addresses.push([
      reserveToken.stToken.address,
      reserveToken.stToken.decimals,
    ])
  }

  return addresses
}

const getTokenAllowances = (reserveToken: ReserveToken): [string, string][] => {
  const tokens: [string, string][] = [
    ...reserveToken.collaterals.map((token): [string, string] => [
      token.address,
      reserveToken.isRSV ? RSV_MANAGER : reserveToken.address,
    ]),
  ]

  // RSR -> stRSR allowance
  if (reserveToken.stToken) {
    tokens.push([RSR.address, reserveToken.stToken.address])
  }

  // RSV -> RSV_MANAGER
  if (reserveToken.isRSV) {
    tokens.push([reserveToken.address, RSV_MANAGER])
  }

  return tokens
}

const getZapTokenAllowances = (
  zapTokens: Token[],
  reserveToken: ReserveToken
): [string, string][] => {
  return [
    ...[...zapTokens, reserveToken].map((token): [string, string] => [
      token.address,
      ZAPPER_CONTRACT[CHAIN_ID],
    ]),
  ]
}

/**
 * Updates the balances of the current ReserveToken related tokens
 */
const TokensBalanceUpdater = () => {
  const account = useAtomValue(walletAtom)
  const reserveToken = useAtomValue(rTokenAtom)
  const zapTokens = useAtomValue(zapTokensAtom)
  const updateBalances = useSetAtom(balancesAtom)
  const balances = useTokensBalance(
    reserveToken && account ? getTokens(reserveToken, zapTokens) : [],
    account
  )

  useEffect(() => {
    updateBalances(balances)
  }, [JSON.stringify(balances)])

  return null
}

/**
 * Update allowances for:
 * Collaterals (n) -> RToken
 * RSR -> stRSR
 * If RSV: RSV -> RSVManager (redeem)
 */
const TokensAllowanceUpdater = () => {
  const account = useAtomValue(walletAtom)
  const reserveToken = useAtomValue(rTokenAtom)
  const zapTokens = useAtomValue(zapTokensAtom)
  const updateAllowances = useSetAtom(allowanceAtom)
  const updateZapAllowances = useSetAtom(zapTokensAllowanceAtom)

  const allowances = useTokensAllowance(
    reserveToken && account ? getTokenAllowances(reserveToken) : [],
    account
  )

  const zapAllowances = useTokensAllowance(
    reserveToken && account
      ? getZapTokenAllowances(zapTokens, reserveToken)
      : [],
    account
  )

  useEffect(() => {
    updateAllowances(allowances)
    updateZapAllowances(zapAllowances)
  }, [JSON.stringify(allowances), JSON.stringify(zapAllowances)])

  return null
}

const fetcher = async (url: string): Promise<StringMap> => {
  const data: Response = await fetch(url).then((res) => res.json())

  return data
}

/**
 * Fetch pending issuances
 */
const PendingBalancesUpdater = () => {
  const account = useAtomValue(walletAtom)
  const chainId = useAtomValue(chainIdAtom)
  const rToken = useAtomValue(rTokenAtom)
  const setPendingIssuances = useUpdateAtom(pendingIssuancesAtom)
  const setPendingRSR = useUpdateAtom(pendingRSRAtom)
  const facadeContract = useFacadeContract()
  const blockNumber = useBlockNumber()

  // TODO: Use multicall for this
  const fetchPending = useCallback(
    async (account: string, rToken: string, facade: Facade) => {
      try {
        const pendingIssuances = await facade.pendingIssuances(rToken, account)
        const pending = pendingIssuances.map((issuance) => ({
          availableAt: parseInt(formatEther(issuance.availableAt)),
          index: issuance.index,
          amount: parseFloat(formatEther(issuance.amount)),
        }))
        setPendingIssuances(pending)

        const pendingRSR = await facade.pendingUnstakings(rToken, account)
        const pendingRSRSummary = pendingRSR.map((item) => ({
          availableAt: item.availableAt.toNumber(),
          index: item.index,
          amount: parseFloat(formatEther(item.amount)),
        }))
        setPendingRSR(pendingRSRSummary)
      } catch (e) {
        // TODO: handle error case
        console.log('error fetching pending', e)
      }
    },
    []
  )

  useEffect(() => {
    if (rToken && !rToken.isRSV && facadeContract && blockNumber && account) {
      fetchPending(account, rToken.address, facadeContract)
    } else {
      setPendingIssuances([])
      setPendingRSR([])
    }
  }, [rToken?.address, facadeContract, account, blockNumber, chainId])

  return null
}

/**
 * Fetch prices for:
 * ETH    -> USD
 * RSR    -> USD
 * RToken -> USD
 * GasPrice
 */
const PricesUpdater = () => {
  const { provider, chainId } = useWeb3React()
  const rTokenPrice = useRTokenPrice()
  const setRSRPrice = useUpdateAtom(rsrPriceAtom)
  const setEthPrice = useUpdateAtom(ethPriceAtom)
  const setGasPrice = useUpdateAtom(gasPriceAtom)
  const setRTokenPrice = useUpdateAtom(rTokenPriceAtom)
  const blockNumber = useBlockNumber()

  const fetchGasPrice = useCallback(async (provider: Web3Provider) => {
    try {
      const feeData = await provider.getFeeData()

      if (feeData.maxFeePerGas) {
        setGasPrice(Number(formatEther(feeData.maxFeePerGas?.toString())) * 0.6)
      } else {
        setGasPrice(0)
      }
    } catch (e) {
      console.error('Error fetching gas price', e)
    }
  }, [])

  const fetchTokenPrices = useCallback(async (provider: Web3Provider) => {
    try {
      const callParams = {
        abi: OracleInterface,
        address: ORACLE_ADDRESS[CHAIN_ID],
        method: 'getPriceUsdc',
      }

      const [rsvPrice, rsrPrice, wethPrice] = await promiseMulticall(
        [
          { ...callParams, args: [RSV_ADDRESS[CHAIN_ID]] },
          { ...callParams, args: [RSR_ADDRESS[CHAIN_ID]] },
          { ...callParams, args: [WETH_ADDRESS[CHAIN_ID]] },
        ],
        provider
      )
      setRSRPrice(+formatUnits(rsrPrice, 6))
      setEthPrice(+formatUnits(wethPrice, 6))
    } catch (e) {
      console.error('Error fetching token prices', e)
    }
  }, [])

  useEffect(() => {
    if (chainId && blockNumber && provider) {
      fetchGasPrice(provider)
      fetchTokenPrices(provider)
    }
  }, [chainId, blockNumber])

  useEffect(() => {
    setRTokenPrice(rTokenPrice)
  }, [rTokenPrice])

  return null
}

// TODO: Change place
const ExchangeRateUpdater = () => {
  const rToken = useAtomValue(rTokenAtom)
  const setRate = useUpdateAtom(rsrExchangeRateAtom)
  const { value } =
    useContractCall(
      rToken?.stToken?.address && {
        abi: StRSRInterface,
        address: rToken?.stToken?.address ?? '',
        method: 'exchangeRate',
        args: [],
      }
    ) ?? {}

  useEffect(() => {
    if (value && value[0]) {
      setRate(Number(formatEther(value[0])))
    }
  }, [value])

  return null
}

/**
 * Updater
 */
const Updater = () => (
  <>
    <TokenUpdater />
    <PendingBalancesUpdater />
    <TokensBalanceUpdater />
    <TokensAllowanceUpdater />
    <PricesUpdater />
    <ExchangeRateUpdater />
    <AccountUpdater />
    <RSVUpdater />
  </>
)

export default Updater
