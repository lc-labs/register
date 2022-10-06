import { Trans } from '@lingui/macro'
import { SmallButton } from 'components/button'
import { useNavigate } from 'react-router-dom'
import { Box, BoxProps, Text, Grid, Divider } from 'theme-ui'
import { ROUTES } from 'utils/constants'

const About = (props: BoxProps) => {
  const navigate = useNavigate()

  return (
    <Box>
      <Grid columns={2} my={7} pl={3} gap={6}>
        <Box>
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>This app</Trans>
          </Text>
          <Text variant="legend">
            Register is developed and maintained by LC Labs as the first dApp to interact with the Reserve Protocol and various RTokens deployed with the platform.            <br />
            <br />
            If an RToken is listed on Register, it doesn't mean that Reserve or LC Labs endorses the safety or risk levels of the RToken. LC Labs requires Github requests with additional information beyond what is available on the blockchain to give users relevant data to make informed decisions. As a user, please evaluate any new RToken carefully before holding or staking your RSR on them.
          </Text>
          <br />
          <br />
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>Storage of usage data</Trans>
          </Text>
          <Text variant="legend">
            LC Labs uses industry standard anonymized analytics tools to understand usage and improve the user experience. LC labs does not collect any information about users or their financial activity.
            <br />
            <br />
            Please keep in mind that interactions with the Ethereum blockchain are pseudonymous and publicly available.
          </Text>
          <br />
          <br />
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>Reserve Protocol</Trans>
          </Text>
          <Text variant="legend">
          Reserve aims to help people around the world maintain their spending power by allowing anyone to create asset-backed currencies with tokenized assets on the Ethereum blockchain in customizable and novel ways. Read more here in Reserve's documentation. (link https://reserve.org/protocol/)
          </Text>
          <br />
          <br />
        <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>RTokens & Deploying your own </Trans>
          </Text>
          <Text variant="legend">
          The creation of new RToken designs is permissionless. If you are the inventive type and have ideas for what assets should be in the basket, what good governance looks like, or anything novel that could work within the realms of the protocol, please consider putting those ideas into practice or sharing them with the community.  
          </Text>
          <br />
          <SmallButton py={2} mt={4} onClick={() => navigate(ROUTES.DEPLOY)}>
            <Trans>Deploy RToken</Trans>
          </SmallButton>
        </Box>
        <Box>
        </Box>
      </Grid>
    </Box>
  )
}

export default About
