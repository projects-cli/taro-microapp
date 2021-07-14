import React, { useState, useCallback, useEffect } from 'react'
import { navigateTo } from '@tarojs/taro'
import { ScrollView, View, Text, Image } from '@tarojs/components'
import classNames from 'classnames/bind'
import { useQueryClient } from 'react-query'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { path } from 'ramda'

import { useBigCategory, useSubcategory } from '@/hooks/homeHooks'
import personalityTest from '@/static/images/home/personality-test.png'
import styles from './index.modules.scss'

const cx = classNames.bind(styles)

const Home:React.FC = () => {
  const queryClient = useQueryClient()
  const [currentTab, setCurrentTab] = useState(0)
  const [subjectId, setSubjectId] = useState()
  const [isShowAll, setShowAll] = useState(false)

  const { status, data: bigCategory, error, isFetching } = useBigCategory()

  useEffect(() => {
    setSubjectId(path([0, '_id'], bigCategory))
  }, [bigCategory])
  const { data: subCategory } = useSubcategory({ subjectId })

  const gotoDetail = useCallback((id) => {
    navigateTo({
      url: '/pages/majorDetail/index?id=' + id
    })
  }, [])

  const changeTab = useCallback((index) => {
    setCurrentTab(index)
    setShowAll(false)
    setSubjectId(path([index, '_id'], bigCategory))
  }, [bigCategory])

  const showMore = useCallback(() => {
    setShowAll(true)
  }, [])

  return (
    <View className={cx('home-page')}>
      <ScrollView scrollY className={cx('container')}>
        <AtTabs
          className={cx('tabs')}
          current={currentTab}
          scroll
          swipeable={false}
          tabList={bigCategory?.map(item => ({ ...item, title: item.name }))}
          onClick={changeTab}
        >
          {
            bigCategory?.map((item, index) => (
              <AtTabsPane current={currentTab} index={index} key={item.id}>
                <View className={cx('tab-item-body')}>
                  <View className={cx('introduction-wrap')}>
                    <Text className={cx('introduction')}>{item.introduction}</Text>
                  </View>
                  <View className={cx('major')}>
                    <View className={cx('major-list')}>
                      {
                        subCategory?.slice(0, isShowAll ? subCategory.length : 4).map((item) => (
                          <View className={cx('major-item')} key={item._id} onClick={() => gotoDetail(item._id)}>
                            <Text>{item.name}</Text>
                            <Text>{item.nameEn}</Text>
                          </View>
                        ))
                      }
                    </View>
                    {
                      !isShowAll && <View className={cx('major-more')} onClick={showMore}>查看更多专业</View>
                    }
                  </View>
                  <Image src={personalityTest} className={cx('personality-test')} />
                  <View className={cx('school')}>
                    <View className={cx('title')}>相关院校</View>
                    <View className={cx('school-list')}>
                      {
                        item?.relatedUniversities.slice(0, 3)?.map((item, index) => (
                          <View key={index} className={cx('school-item')}>
                            <View className={cx('info-wrap')}>
                              <Image src={item.logoUrl} />
                              <View className={cx('info')}>
                                <Text>{item.officialName}</Text>
                                <Text>{item.officialNameEn}</Text>
                                <Text>{item.country} | {item.province} | {item.city}</Text>
                              </View>
                            </View>
                            <View className={cx('tag-list')}>
                              {
                                item.labels.map((val, key) => <View className={cx('tag-item')} key={key}>{val}</View>)
                              }
                            </View>
                            <View className={cx('ranking')}>
                              <View className={cx('global', 'ranking-item')}>
                                <View>{item.ranks.QS}</View>
                                <Text>全球OS排名</Text>
                              </View>
                              <View className={cx('times', 'ranking-item')}>
                                <View>{item.ranks.TIMES}</View>
                                <Text>TIMES排名</Text>
                              </View>
                            </View>
                          </View>
                        ))
                      }
                    </View>
                  </View>
                </View>
              </AtTabsPane>)
            )
          }

        </AtTabs>
        {/* <View>
          {
            status === 'loading' ? (
              'Loading...'
            ) : status === 'error' ? (
              <span>Error: {error.message}</span>
            ) : (
              <View>fdfd</View>
              // data?.map(item => <View key={item.id}>{item.title}</View>)
            )
          }
        </View> */}
      </ScrollView>
    </View>
  )
}

export default Home
