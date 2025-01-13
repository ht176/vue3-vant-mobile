<script setup lang="ts">
import { CureShiftServiceProxy } from '@/services/CureV1_2ServiceProxies'
import { HashCodeBase64, HmacSHA256encrypt } from '@/utils/crypto'
// import { clearRememberUid, getRememberUid, setRememberUid } from '@/utils/storage'
import { type RouteMap, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import jlLogo from '~/images/login_jl.png'
import { LoginViewModel } from '@/services/ServiceProxies'
import { DeptDialysisAreaServiceProxy } from '@/services/DeptV1ServiceProxies'
import { showNotify } from 'vant'
import { getToken } from '@/utils/auth'
import { SysDicItemServiceProxy, SysFieldItemServiceProxy, SysSettingServiceProxy } from '@/services/SysServiceProxies'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

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
  const transformFormData = Object.assign({}, { ...formData, password: HashCodeBase64(HmacSHA256encrypt(formData.password)) })
  const res = await userStore.login(transformFormData)
  if (res.success) {
    // if (viewData.rememberPassword) {
    //   const userRemember = JSON.parse(getRememberUid())
    //   if (!userRemember || userRemember.username !== formData.userName) {
    //     setRememberUid(JSON.stringify({
    //       username: formData.userName,
    //       password: formData.password,
    //       HospitalAreaName: '',
    //       HospitalAreaId: formData.hospitalAreaId,
    //     }))
    //   }
    // }
    // else {
    //   clearRememberUid()
    //   // clearCureFilter()
    // }
    await loadOtherInfo()
    router.push({
      name: (redirect as keyof RouteMap) || 'dialysis-home',
      query: {
        ...othersQuery,
      },
    })
  }
  else {
    showNotify({
      type: 'danger',
      message: res.message,
    })
  }
  viewData.loading = false
}
/** 加载相关数据 */
async function loadOtherInfo() {
  viewData.loadingText = '正在加载配置信息...'
  await Promise.all([getShiftList(), getDialysisAreaList(), getSysSettingList(), getSysFiledList(), getDicDataList()])
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
    appStore.setDialysisShifts(res.data)
  }
  else {
    showNotify({ type: 'danger', message: res.message })
  }
}
/**
 * 获取透析区域列表
 */
async function getDialysisAreaList() {
  const token = getToken()
  const deptDialysisAreaServiceProxy = new DeptDialysisAreaServiceProxy()
  const data = {
    filter: {
      PageIndex: 1,
      PageSize: 1000,
      Predicate: '',
      PredicateValues: [],
      Ordering: 'Sequence ASC',
    },
  }
  const res = await deptDialysisAreaServiceProxy.tree(token.hid, 0, data as typeof undefined)
  if (res.success) {
    appStore.setDialysisAreas(res.data)
  }
  else {
    showNotify({ type: 'danger', message: res.message })
  }
}
/**
 * 获取系统参数信息
 */
async function getSysSettingList() {
  const sysSettingServiceProxy = new SysSettingServiceProxy()
  const filter = {
    PageIndex: 1,
    PageSize: 10000000,
    Predicate: '1=1',
    PredicateValues: [],
  }
  const res = await sysSettingServiceProxy.filter29(JSON.stringify(filter))
  if (res.success) {
    appStore.setSettingList(res.data)
  }
  else {
    showNotify({ type: 'danger', message: res.message })
  }
}
/** 获取流程自定义字段 */
async function getSysFiledList() {
  const sysFieldTypeCodes = 'MeasureCureBefore,Prescribing.PatientSource,Prescribing.QuickPrescription,Prescribing.PrescriptionInfo,Prescribing.VitalSigns,Prescribing.Dialysate,OnCureMiddle.PatientSource,OnCureMiddle.CureMode,OnCureMiddle.MeasureCureBefore,OnCureMiddle.Dialysate,VerifyCureMiddle.PatientSource,VerifyCureMiddle.CureMode,VerifyCureMiddle.MeasureCureBefore,VerifyCureMiddle.Dialysate,OffCure,Disinfect'
  const sysFieldItemServiceProxy = new SysFieldItemServiceProxy()
  const { success, data } = await sysFieldItemServiceProxy.codes(sysFieldTypeCodes, '')
  if (success) {
    appStore.setSysFiledList(data)
  }
}
/** 获取所有字典及明细 */
async function getDicDataList() {
  const sysDicItemServiceProxy = new SysDicItemServiceProxy()
  const { success, data } = await sysDicItemServiceProxy.all()
  if (success) {
    appStore.setDicDataList(data)
  }
}
</script>

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
