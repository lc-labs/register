import { Trans } from '@lingui/macro'
import { SmallButton } from 'components/button'
import { useNavigate } from 'react-router-dom'
import { Box, BoxProps, Text, Grid, Divider } from 'theme-ui'
import { ROUTES } from 'utils/constants'

const About = (props: BoxProps) => {
  const navigate = useNavigate()

  return (
    <Box>
      <Grid columns={2} mt={6} pl={3} gap={8}>
        <Box>
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>This app</Trans>
          </Text>
          <Text variant="legend">
            Register is developed and maintained by LC Labs as the first interface to interact with RTokens on the Reserve protocol.
            <br />
            <br />
            **[Say something about how it's hosted and how one might go about creating their UI]**
            <br />
            <br />
            Register listed RTokens doesn't mean Reserve or LC Labs endorses the token. LC Labs requires Github requests with additional info beyond what is on the blockchain to list tokens and for them to not be apparent scams. Please evaluate unproven RTokens carefully before holding or staking your RSR on them.
          </Text>
          <br />
          <br />
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>Storage of usage data</Trans>
          </Text>
          <Text variant="legend">
            LC Labs do not currently track any usage of Register but keep in mind that interactions on the blockchain are public.
            <br />
            <br />
            As we don't track usage, please let us know if you're experiencing problems or if anything is hard to understand. Unfortunately, we won't be able to correct things based on analyzing where many people drop off/get stuck.
          </Text>
          <br />
          <br />
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>Reserve Protocol</Trans>
          </Text>
          <Text variant="legend">
            This interface lets you interact with the Reserve Protocol RTokens or to create your own. Doing so is permissionless and can be done without this or other interfaces if you're a technical person. Reserve is a project trying to solve the problem of inflation by letting anyone create asset-backed currencies with tokenized assets on the Ethereum blockchain in customizable and novel ways. 
          </Text>
        </Box>
        <Box
         sx={{ borderRight: '1px solid', borderColor: 'darkBorder' }}
        >
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>RTokens</Trans>
          </Text>
          <Text variant="legend">
            Anyone can create an RToken with the basket, revenue model, and governance that they think is best and that the protocol supports technically. The original writers of the factory Ethereum contracts have never themselves launched an RToken and never intend to. The best RTokens will not only be diversified in assets and jurisdictions but also earn revenue and have competent governance.
          </Text>
          <br />
          <br />
          <Text mb={2} sx={{ fontSize: 3, display: 'block', fontWeight: 500 }}>
            <Trans>Deploy your own RToken</Trans>
          </Text>
          <Text variant="legend">
            Do you think you might have a superior RToken design, basket, or governance and want to put it to practice? 
          </Text>
          <br />
          <SmallButton py={2} mt={6} onClick={() => navigate(ROUTES.DEPLOY)}>
            <Trans>Deploy RToken</Trans>
          </SmallButton>
          
        </Box>
      </Grid>
    </Box>
  )
}

export default About
