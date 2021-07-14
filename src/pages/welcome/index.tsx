import React from 'react'
import { Image, View, Button } from '@tarojs/components'
import classNames from 'classnames/bind'
import { useQueryClient } from 'react-query'
import { navigateTo } from '@tarojs/taro'

import NavBar from '@/components/NavBar'
import { getWxUserInfo, getLoginCode } from '@/utils/system'
import { useLogin } from '@/hooks/authHooks'
import welcomeImg from '@/static/images/welcome/welcome.jpg'
import styles from './index.modules.scss'

const cx = classNames.bind(styles)

const Welcome:React.FC = () => {
  // const queryClient = useQueryClient()
  const loginMutation = useLogin()
  console.log(18889, loginMutation)
  const wxLogin = async () => {
    const infoRes = await getWxUserInfo()
    const code = await getLoginCode()
    const a = loginMutation.mutate(code)
    // const a = loginMutation()
    // a(code)
    // queryClient.setQueryData('post', fetchData)
    console.log(1666, infoRes)
    console.log(167777, a)
  }

  return (
    <View className={cx('welcome-page')}>
      <NavBar immersion />
      <Button hoverClass='none' onClick={wxLogin}>登录</Button>
      <Image mode='scaleToFill' src={welcomeImg} />
    </View>
  )
}

export default Welcome
