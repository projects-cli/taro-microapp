import { useQuery } from 'react-query'

import { homeService } from '@/service'

export const useBigCategory = () => {
  return useQuery('bigCategoryHooks', homeService.getBigCategory)
}

export const useSubcategory = (params) => {
  return useQuery(
    ['subcategoryHooks-' + params.subjectId, params],
    homeService.getSubcategory,
    {
      enabled: !!params.subjectId
    }
  )
}
