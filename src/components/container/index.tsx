import { Box, BoxProps } from 'theme-ui'

/**
 * Wraps the page content
 *
 * @param {ReactNode} children
 * @returns
 */
const Container = ({ sx = {}, ...props }: BoxProps) => (
  <Box
    sx={{ boxSizing: 'border-box', padding: [4, '32px 32px'], ...sx }}
    {...props}
  />
)

export default Container
