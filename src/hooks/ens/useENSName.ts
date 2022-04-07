import { Interface } from '@ethersproject/abi'
import { namehash } from '@ethersproject/hash'
import { useWeb3React } from '@web3-react/core'
import useDebounce from 'hooks/useDebounce'
import { useMemo } from 'react'
import ENSResolverAbi from '../../abis/ens-public-resolver.json'
import ENSRegistrarAbi from '../../abis/ens-registrar.json'
import { ENS_ADDRESS } from '../../constants/addresses'
import { isAddress, isZero } from '../../utils'

const ENSRegistrarInterface = new Interface(ENSRegistrarAbi)
const ENSResolverInterface = new Interface(ENSResolverAbi)

/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
const useENSName = (
  address?: string | undefined | null
): {
  ENSName: string | null
  loading: boolean
} => {
  const { chainId } = useWeb3React()
  const debouncedAddress = useDebounce(address, 200)
  const ensNodeArgument = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined]
    try {
      return debouncedAddress
        ? [namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)]
        : [undefined]
    } catch (error) {
      return [undefined]
    }
  }, [debouncedAddress])

  // TODO: ENS currently only works in mainnet
  // TODO: Maybe a good idea to create a different hook that looks in mainnet independently of the current chainId
  // const [resolverAddress] = useCall(
  //   chainId === ChainId.Mainnet && {
  //     abi: ENSRegistrarInterface,
  //     address: ENS_ADDRESS[chainId],
  //     method: 'resolver',
  //     args: ensNodeArgument,
  //   }
  // ) ?? [undefined]

  // const [name] = useContractCall(
  //   !!resolverAddress &&
  //     !isZero(resolverAddress) && {
  //       abi: ENSResolverInterface,
  //       address: resolverAddress,
  //       method: 'name',
  //       args: ensNodeArgument,
  //     }
  // ) ?? [undefined]
  const name = ''
  const resolverAddress = ''

  const changed = debouncedAddress !== address
  return {
    ENSName: changed ? null : name ?? null,
    loading: changed,
  }
}

export default useENSName
