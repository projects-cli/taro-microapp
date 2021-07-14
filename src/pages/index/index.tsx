import { useEffect } from 'react'
import { redirectTo } from '@tarojs/taro'

const Index = () => {
  useEffect(() => {
    redirectTo({
      url: '/pages/welcome/index'
    })
  }, [])

  return null
}

export default Index
