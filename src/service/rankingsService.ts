import { QueryFunctionContext } from 'react-query'
import { restful } from '@/utils'

export const getRankings = async ({ queryKey }) => {
  const res = await restful.request({
    url: 'https://api.myoffer.cn/api/v1/university-top-list',
    params: queryKey[1]
  })

  if (res.code === 0) return res?.result
}

export const getColleges = async (content: QueryFunctionContext) => {
  const { queryKey, pageParam } = content

  const res = await restful.request({
    url: 'https://api.myoffer.cn/api/v1/university-ranks',
    params: { ...queryKey[1] as Object, pageNo: pageParam }
  })

  if (res.code === 0) return res?.result
}
