import React, { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { getCurrentPages, useReachBottom } from '@tarojs/taro'
import classNames from 'classnames/bind'

import { useRankings, useColleges } from '@/hooks/rankingsHooks'
import styles from './index.modules.scss'

const cx = classNames.bind(styles)

const Rankings = () => {
  const [queryIdObj, setQueryIdObj] = useState()
  useEffect(() => {
  // 该函数获取所有栈内的路由
    const pages = getCurrentPages()
    // 数组中最后一个即当前路由，options是参数
    const { options } = pages.pop()
    setQueryIdObj(options)
  }, [])

  const { name, enName, ...rest } = queryIdObj || {}
  const { data: ranking = {} } = useRankings(rest)
  const { data: colleges = {}, fetchNextPage, hasNextPage, isFetching } = useColleges(ranking?._id)

  const gotoSchool = (id) => {
    console.log(2666, id)
  }

  useReachBottom(() => {
    console.log('onReachBottom')
    hasNextPage && fetchNextPage()
  })

  return (
    <View className={cx('rankings-page')}>
      <View className={cx('title')}><Text>{decodeURIComponent(name)}</Text><Text>{decodeURIComponent(enName)}</Text></View>
      <View className={cx('at-row', 'hander')}>
        <View className={cx('at-col', 'at-col-2')}>排名</View>
        <View className={cx('at-col', 'at-col-5')}>院校</View>
        <View className={cx('at-col', 'at-col-2')}>QS排名</View>
        <View className={cx('at-col', 'at-col-3')}>查看详情</View>
      </View>
      <View className={cx('body')}>
        {
          colleges?.pages?.map((page) => (
            page?.docs.map((item) => (
              <View className={cx('at-row')} key={item._id}>
                <View className={cx('at-col', 'at-col-2')}>{item.rank}</View>
                <View className={cx('at-col', 'at-col-5')}>
                  <Image className={cx('logo')} src={item.logoUrl} />
                  {item.officialName}
                </View>
                <View className={cx('at-col', 'at-col-2')}>{item.QS || '-'}</View>
                <View className={cx('at-col', 'at-col-3')}><View onClick={() => gotoSchool(item._id)}>查看详情</View></View>
              </View>
            ))
          ))
        }
      </View>
      <View className={cx('footer')} style={{ display: isFetching || !hasNextPage ? 'block' : 'none' }}>{isFetching ? '正在加载' : hasNextPage ? '' : '没有更多'}</View>
    </View>
  )
}

export default Rankings
