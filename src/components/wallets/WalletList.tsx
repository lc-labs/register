import { useAppSelector } from 'state/hooks'
import { Box, FlexProps, BoxProps, Flex, Text } from '@theme-ui/components'
import { Wallet } from 'state/wallets/reducer'
import Blockies from 'react-blockies'
import { useEthers } from '@usedapp/core'
import styled from '@emotion/styled'

const GreenCircle = styled('span')`
  display: inline-block;
  border-radius: 50%;
  background-color: #00b902;
  height: 0.8em;
  width: 0.8em;
`

const WalletContainer = styled(Flex)`
  align-items: center;
  cursor: pointer;
`

interface WalletItemProps extends FlexProps {
  wallet: Wallet
  current?: boolean
  connected?: boolean
}

interface WalletListProps extends Omit<BoxProps, 'onChange'> {
  onChange?(walletAddress: string): void
}

const WalletItem = ({
  wallet,
  current = false,
  connected = false,
  ...props
}: WalletItemProps) => (
  <WalletContainer {...props}>
    <Blockies seed={wallet.address} />
    <Box ml={3}>
      <Text>{wallet.alias}</Text>
      {connected && <GreenCircle style={{ marginLeft: 5 }} />}
      <Text sx={{ display: 'block' }}>$ Balance</Text>
    </Box>
    {current && <Text sx={{ marginLeft: 3, color: '#ccc' }}>Selected</Text>}
  </WalletContainer>
)

const WalletList = ({ onChange = () => {}, ...props }: WalletListProps) => {
  const { account } = useEthers()
  const [walletList, current] = useAppSelector(({ wallets }) => [
    wallets.list,
    wallets.current,
  ])

  if (!Object.keys(walletList).length) {
    return <Box>No wallets added</Box>
  }

  return (
    <Box {...props}>
      {!!account && !!walletList[account] && (
        <Box>
          <Text>Your wallet</Text>
          <WalletItem
            onClick={() => onChange(account)}
            wallet={walletList[account]}
            current={current === account}
            connected
          />
        </Box>
      )}
      <Box mt={3}>
        <Text>Tracked accounts</Text>
        {Object.values(walletList).map((wallet) =>
          wallet.address !== account ? (
            <WalletItem
              onClick={() => onChange(wallet.address)}
              key={wallet.address}
              wallet={wallet}
              current={wallet.address === current}
            />
          ) : null
        )}
      </Box>
    </Box>
  )
}

export default WalletList
