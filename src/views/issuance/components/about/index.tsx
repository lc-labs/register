import { Trans } from '@lingui/macro'
import { Box, Text } from 'theme-ui'

const About = () => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'darkBorder',
      borderRadius: '16px',
    }}
    p={4}
  >
    <Text sx={{ fontWeight: 500, display: 'block' }} mb={2}>
          <Trans>Mint/Redeem</Trans>
      </Text>
      <Text sx={{ color: 'lightText' }}>
        Ac turpis egestas maecenas pharetra. Habitant morbi tristique senectus
        et. Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae.
        Bibendum est ultricies integer quis auctor. Nunc congue nisi vitae
        suscipit tellus mauris. ollicitudin. Nulla facilisi etiam dignissim diam
        quis enim lobortis.
      </Text>
      <br />
      <br />
      <Text sx={{ fontWeight: 500, display: 'block' }} mb={2}>
        <Trans>About this app</Trans>
      </Text>
      <Text sx={{ color: 'lightText' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Senectus et netus et
        malesuada fames ac turpis egestas integer. Ac turpis egestas integer
        eget et pharetra pharetra massa massa. Nibh venenatis cras sed felis.
        Ante metus dictum at tempor commodo ullamcorper.
      </Text>
  </Box>
)

export default About
