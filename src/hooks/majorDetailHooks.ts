import { useQuery } from 'react-query'

import { majorDetailService } from '@/service'

export const useBigCategory = (majorId) => {
  return useQuery(
    ['majorDetailHooks-' + majorId, majorId],
    majorDetailService.getMajorDetail,
    {
      enabled: !!majorId
    }
  )
}
