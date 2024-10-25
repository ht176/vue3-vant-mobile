<template>
  <el-row class="h-full bg-white">
    <el-col :span="15">
      <img :src="jlLogo" class="h-full w-full">
    </el-col>
    <el-col :span="9">
      <div class="h-full flex flex-col justify-center px-6">
        <van-form :model="formData" :rules="rules" validate-trigger="onSubmit" @submit="login">
          <van-field v-model="formData.userName" class="login_input" name="userName" :rules="rules.userName" left-icon="contact" clearable label="账号" placeholder="请输入账号" />
          <van-field v-model="formData.password" class="login_input" name="password" :rules="rules.password" left-icon="goods-collect-o" type="password" label="密码" placeholder="请输入密码" />
          <div class="mt-4">
            <van-button type="primary" size="small" block :loading="viewData.loading" loading-type="spinner" :loading-text="viewData.loadingText" :disabled="viewData.loading" native-type="submit">
              登 录
            </van-button>
          </div>
        </van-form>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { CureShiftServiceProxy } from '@/services/CureV1_2ServiceProxies'
import { LoginViewModel, TokenServiceProxy } from '@/services/ServiceProxies'
import { setToken } from '@/utils/auth'
import { HashCodeBase64, HmacSHA256encrypt } from '@/utils/crypto'
import { clearRememberUid, getRememberUid, setRememberUid } from '@/utils/storage'
import { type RouteMap, useRouter } from 'vue-router'
// import { useUserStore } from '@/stores'
import jlLogo from '~/images/login_jl.png'

const router = useRouter()
// const userStore = useUserStore()

const viewData = reactive({
  loading: false,
  loadingText: '',
  rememberPassword: false,
})
const formData = reactive(new LoginViewModel({
  userName: '',
  password: '',
}))
const rules = reactive({
  userName: [
    { required: true, message: '请输入账号' },
  ],
  password: [
    { required: true, message: '请输入密码' },
  ],
})

async function login() {
  viewData.loading = true
  const { redirect, ...othersQuery } = router.currentRoute.value.query
  const tokenServiceProxy = new TokenServiceProxy()
  const transformFormData = Object.assign({}, { ...formData, password: HashCodeBase64(HmacSHA256encrypt(formData.password)) })
  const res = await tokenServiceProxy.tokenPOST(transformFormData)
  if (res.success) {
    if (viewData.rememberPassword) {
      const userRemember = JSON.parse(getRememberUid())
      if (!userRemember || userRemember.username !== formData.userName) {
        setRememberUid(JSON.stringify({
          username: formData.userName,
          password: formData.password,
          HospitalAreaName: '',
          HospitalAreaId: formData.hospitalAreaId,
        }))
      }
    }
    else {
      clearRememberUid()
      // clearCureFilter()
    }
    const { sid: id, uid, uname: name, hid, sysUserAreas, expity } = res.data
    const token = { id, hid, uid, name, sysUserAreas, insertTime: new Date(), expireInterval: expity * 60 * 60 }
    setToken(token)
    await loadOtherInfo()
    router.push({
      name: (redirect as keyof RouteMap) || 'dialysis-home',
      query: {
        ...othersQuery,
      },
    })
  }
  viewData.loading = false
}
/** 加载相关数据 */
async function loadOtherInfo() {
  viewData.loadingText = '正在加载班次信息...'
  await getShiftList()
}
/** 获取班次信息 */
async function getShiftList() {
  const cureShiftServiceProxy = new CureShiftServiceProxy()
  const filter = {
    PageIndex: 1,
    PageSize: 1000,
    Predicate: '',
    PredicateValues: [],
    Ordering: 'Sequence ASC',
  }
  const res = await cureShiftServiceProxy.filter3(JSON.stringify(filter))

  if (res.success) {
    // db.set('cureShiftList', result.data).write()

    // console.log(db.get('cureShiftList').write())
  }
  else {
    this.$toast.fail(res.message)
  }
}
</script>

<style>
.login_input {
  border: 0.5px solid #d6d3d380;
  border-radius: 0.4vw;
  margin-top: 16px;
}
</style>

<route lang="json">
  {
    "name": "login",
    "meta": {
      "title": "登录"
    }
  }
</route>
