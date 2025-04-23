'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

// You can define or use Chakra UI's default theme
const theme = extendTheme({
  // custom theme overrides here if any
})

export function Provider(props) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
