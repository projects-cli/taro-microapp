import { restful } from '@/utils'

// 登录
export const login = async (code) => {
  const res = await restful.request({
    method: 'post',
    url: 'https://api.myoffer.cn/api/v1/applet/login',
    data: {
      code,
      appletName: 'lecture'// 'major'
    }
  })

  if (res.code === 0) return true
}
