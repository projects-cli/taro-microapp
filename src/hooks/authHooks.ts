import { useMutation } from 'react-query'

import { authService } from '@/service'

export const useLogin = () => useMutation(
  async code => await authService.login(code)
)
