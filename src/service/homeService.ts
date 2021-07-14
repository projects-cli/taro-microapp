import { restful } from '@/utils'

// 获取专业大类列表
export const getBigCategory = async () => {
  const res = await restful.request({
    url: 'https://api.myoffer.cn/api/v1/uni/base-subjects?source=QS&extFields=introduction,relatedUniversities'
  })

  if (res.code === 0) return res?.result?.list
}

// 获取专业小类列表
// pageSize=100&subjectId={学科ID}&pageNo=1
export const getSubcategory = async ({ queryKey }) => {
  const res = await restful.request({
    url: 'https://api.myoffer.cn/api/v1/uni/base-majors',
    params: queryKey[1]
  })

  if (res.code === 0) return res?.result?.list
}
