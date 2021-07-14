import React, { useEffect, useState } from 'react'
import { getCurrentPages, navigateTo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames/bind'
import qs from 'qs'

import { useBigCategory } from '@/hooks/majorDetailHooks'
import styles from './index.modules.scss'

const cx = classNames.bind(styles)

const MajorDetail = () => {
  const [majorId, setMajorId] = useState()
  useEffect(() => {
  // 该函数获取所有栈内的路由
    const pages = getCurrentPages()
    // 数组中最后一个即当前路由，options是参数
    const { options } = pages.pop()
    setMajorId(options?.id)
  }, [])

  const { data = {} } = useBigCategory(majorId)

  const gotoRanking = () => {
    navigateTo({
      url: '/pages/rankings/index?' + qs.stringify({ majorId, subjectId: data?.subject?._id, name: data?.name, enName: data?.nameEn })
    })
  }

  return (
    <View className={cx('major-page')}>
      <View className={cx('major-title')}>
        <Text>{data?.name}</Text>
        <Text>{data.nameEn}</Text>
      </View>
      <View className={cx('main-title')}><Text>所属学科：</Text>{data?.subject?.name}</View>
      <View className={cx('title')}>专业介绍</View>
      <View className={cx('introduce')}>{data.introduction}</View>
      <View className={cx('title')}>主要课程</View>
      <View className={cx('course-list')}>
        {
          data?.keyCourses?.map((item, index) => (
            <View key={index} className={cx('course-item')}><Text>{item.name}</Text><Text>{item.nameEn}</Text></View>
          ))
        }
      </View>
      <View className={cx('title')}>培养方向</View>
      <View className={cx('training-direction')}>{data.education}</View>
      <View className={cx('title')}>就业状况</View>
      <View className={cx('employment-situation')}>
        <View className={cx('item')}><Text>相关职业：</Text><Text>{data?.employment?.relatedJobs}</Text></View>
        <View className={cx('item')}>就业前景</View>
        <View className={cx('content')}>{data?.employment?.prospect}</View>
      </View>
      <View className={cx('related-institutions')} onClick={gotoRanking}>查看相关院校</View>
    </View>
  )
}

export default MajorDetail
