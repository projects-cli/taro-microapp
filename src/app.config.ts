import { useGlobalIconFont } from './components/Iconfont/helper'

export default {
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: [
    'pages/home/index',
    'pages/me/index',
    'pages/other/index',
    'pages/test/index',
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom' // 自定义导航
  },
  tabBar: {
    custom: true,
    color: 'rgba(0, 0, 0, 0.6)',
    selectedColor: 'rgba(0, 162, 0, 1)',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的'
      },
      {
        pagePath: 'pages/other/index',
        text: '其它'
      }
    ]
  }
}
