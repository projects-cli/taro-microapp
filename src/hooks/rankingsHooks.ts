import { useQuery, useInfiniteQuery } from 'react-query'
import qs from 'qs'

import { rankingsService } from '@/service'

export const useRankings = (params) => {
  const data = { ...params, type: 'subject' }

  return useQuery(
    ['rankingsHooks-' + qs.stringify(data), data],
    rankingsService.getRankings,
    {
      enabled: !!params?.subjectId && !!params?.majorId
    }
  )
}

export const useColleges = (id) => {
  return useInfiniteQuery(
    ['collegesHooks-' + id, { topList: id }],
    rankingsService.getColleges,
    {
      enabled: !!id,
      getNextPageParam: (lastPage, pages) => {
        const { count, pageSize = 10 } = lastPage
        const recordsCount = pageSize * pages.length
        return recordsCount < count ? pages.length + 1 : undefined
      }
    }
  )
}
