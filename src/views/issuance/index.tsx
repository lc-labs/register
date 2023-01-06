import { Trans } from '@lingui/macro'
import { Container } from 'components'
import { Box, Grid, Text } from 'theme-ui'
import About from './components/about'
import Balances from './components/balances'
import Issue from './components/issue'
import Redeem from './components/redeem'
import Zap from './components/zap'

/**
 * Mint & Redeem view
 */
const Issuance = () => (
  <Container pb={4}>
    <Text ml={5} mb={4} variant="strong" sx={{ fontSize: 4 }}>
      <Trans>Mint + Redeem</Trans>
    </Text>
    <Grid columns={[1, 1, 1, '2fr 1.5fr']} gap={5}>
      <Box>
        <Box mb={4}>
          <Zap />
        </Box>

        <Grid columns={[1, 2]} gap={4} mb={4}>
          <Issue />
          <Redeem />
        </Grid>
        <Balances />
      </Box>
      <About />
    </Grid>
  </Container>
)

export default Issuance
