export * as homeHooks from './homeHooks'
export * as majorDetailHooks from './majorDetailHooks'
export * as authHooks from './authHooks'
export * as rankingsHooks from './rankingsHooks'

/**
    登录
    "/api/v1/applet/login"
    {appletName: 'xxx', code: 'xxx'}

    接口1、学科列表
    https://api.myoffer.cn/api/v1/uni/base-subjects?source=QS&extFields=introduction

    extFields=introduction 可以得到专业详情信息

    接口2、学科子专业
    https://api.myoffer.cn/api/v1/uni/base-majors?pageSize=100&subjectId={学科ID}&pageNo=1

    接口3、热门院校
    https://api.myoffer.cn/api/v1/uni/base-subjects?source=QS&extFields=relatedUniversities

    接口4、学科子专业详情
    https://api.myoffer.cn/api/v1/uni/base-majors/{专业ID}

    接口5、学科子专业 ： 查看相关院校  得到榜单ID
    https://api.myoffer.cn/api/v1/university-top-list?type=subject&subjectId={学科ID}&majorId={专业ID}

    接口6 、相关院校列表
    https://api.myoffer.cn/api/v1/university-ranks?pageSize=10&topList={榜单ID}&pageNo=1
 */
