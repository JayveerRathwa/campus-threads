import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'

const useShowToast = () => {
  const toast = useToast()

  const showToast = useCallback((title, description, type = 'success') => {
    toast({
      title,
      description,
      status: type,
      duration: 5000,
      isClosable: true,
      position: 'bottom-end',
    })
  }, [toast])

  return showToast
}

export default useShowToast
