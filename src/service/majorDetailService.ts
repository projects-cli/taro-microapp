import { restful } from '@/utils'

export const getMajorDetail = async ({ queryKey }) => {
  const res = await restful.request({
    url: 'https://api.myoffer.cn/api/v1/uni/base-majors/' + queryKey[1]
  })

  if (res.code === 0) return res?.result
}
