<template>
  <div v-loading="loading" style="padding:0.9vw">
    <el-form ref="ruleFormRef" :model="patientModel" :rules="formRules" label-width="auto">
      <el-row>
        <el-col :span="5">
          <!-- 照片 -->
          <el-row class="patient-information-div">
            <el-col :span="24" aling="center">
              <span v-if="patientModel.archiveNumber" style="font-size:16px;">档案编号：{{ patientModel.archiveNumber }}</span>
            </el-col>
            <el-col :span="24" style="margin-top: 10px; padding-left:10px;">
              <Upload v-model:img-list="imagelist" :patient-model="patientModel" />
              <!-- <img :src="`data:image/png;base64,${patientModel.face}`" style="width: 178px;height: 205px"> -->
            </el-col>
            <el-col :span="24" align="center" style="padding-top: 10px">
              <el-button type="primary" size="small">
                人脸识别采集
              </el-button>
            </el-col>
            <!-- <el-col :span="24" style="padding-left:10px;">
              <upload v-model="photoAuxiliarylist" :show-file-list="false" style="width:100%;" list-type="text" upload-class="avatar-uploader" upload-type="avatarSelect" :file-view="1" />
            </el-col> -->
          </el-row>
        </el-col>
        <!-- 基本信息 -->
        <el-col :span="19" class="mt-4">
          <el-row :gutter="20">
            <!-- 姓名 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="姓名：" prop="name">
                <el-input v-model="patientModel.name" placeholder="请输入姓名" @blur="getCode" />
              </el-form-item>
            </el-col>
            <!-- 别名 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="别名：" prop="name2">
                <el-input v-model="patientModel.name2" placeholder="请输入别名" />
              </el-form-item>
            </el-col>
            <!-- 拼音码 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="拼音码：" prop="pinyinCode">
                <el-input v-model="patientModel.pinyinCode" placeholder="请输入拼音" />
              </el-form-item>
            </el-col>
            <!-- 五笔码 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="五笔码：" prop="wubiCode">
                <el-input v-model="patientModel.wubiCode" placeholder="请输入五笔" />
              </el-form-item>
            </el-col>
            <!-- 性别 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="性别：" prop="gender">
                <Dictionary v-model="patientModel.gender" :dic-code="DIC_PEOPLE_GENDER" type="select" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="出生日期：">
                <el-date-picker v-model="patientModel.birthdate as unknown as Date" class="!w-full" type="date" />
              </el-form-item>
            </el-col>
            <!-- 年龄 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="年龄：">
                <el-input v-model="patientModel.age" placeholder="请输入年龄" :readonly="true" />
              </el-form-item>
            </el-col>
            <!-- 民族 -->
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="民族：">
                <Dictionary v-model="patientModel.nationality" :dic-code="DIC_PEOPLE_NATIONALITY" type="select" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="证件类型：">
                <Dictionary v-model="patientModel.idType" :dic-code="DIC_PEOPLE_IDTYPE" type="select" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :style="{ height: '40px' }" label="证件号码：" prop="idNumber">
                <el-input v-model="patientModel.idNumber" placeholder="请输入证件号码" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- 医保类型 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="医保类型：" prop="gender">
            <Dictionary v-model="patientModel.medicareType" :dic-code="DIC_PEOPLE_MEDICARETYPE" type="select" />
          </el-form-item>
        </el-col>
        <!-- 医保号 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="医保号：" prop="MedicareNumber">
            <el-input v-model="patientModel.medicareNumber" placeholder="请输入医保号" />
          </el-form-item>
        </el-col>
        <!-- 来源 -->
        <el-col :span="8">
          <el-form-item :style="{ height: '40px' }" label="来源：" prop="gender">
            <Dictionary v-model="patientModel.source" :dic-code="DIC_PATIENT_SOURCE" type="select" @change="changeSource" />
          </el-form-item>
        </el-col>
        <!-- 病区 -->
        <el-col v-if="patientModel.source === 'INPATIENT'" :span="8">
          <el-form-item :style="{ height: '40px' }" label="病区：" prop="ward">
            <el-input v-model="patientModel.ward" placeholder="请输入病区" />
          </el-form-item>
        </el-col>
        <!-- 科室 -->
        <el-col v-else :span="8">
          <el-form-item :style="{ height: '40px' }" label="科室：" prop="department">
            <el-input v-model="patientModel.department" placeholder="请输入科室" />
          </el-form-item>
        </el-col>
        <!-- 门诊号 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="门诊号：" prop="hospitalNumberOut">
            <el-input v-model="patientModel.hospitalNumberOut" placeholder="请输入门诊号" :disabled="!hospitalization" />
          </el-form-item>
        </el-col>
        <!-- 住院号 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="住院号：" prop="hospitalNumberIn">
            <el-input v-model="patientModel.hospitalNumberIn" placeholder="请输入住院号" :disabled="hospitalization" />
          </el-form-item>
        </el-col>
        <!-- 透析号 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="透析号：" prop="dialysisNumber">
            <el-input v-model="patientModel.dialysisNumber" type="" placeholder="请输入透析号" />
          </el-form-item>
        </el-col>
        <!-- 就诊卡号 -->
        <el-col :span="8">
          <el-form-item :style="{ height: '40px' }" label="就诊卡号：" prop="medicalNumber">
            <el-input v-model="patientModel.medicalNumber" type="" placeholder="请输入就诊卡号" />
          </el-form-item>
        </el-col>
        <!-- 病历夹号 -->
        <el-col :span="8">
          <el-form-item :style="{ height: '40px' }" label="病历夹号：" prop="dossierNumber">
            <el-input v-model="patientModel.dossierNumber" type="" placeholder="请输入病历夹号" />
          </el-form-item>
        </el-col>
        <!-- 首次透析日期 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="首次透析日期：">
            <el-date-picker v-model="patientModel.dialysisDateFirst as unknown as Date" class="!w-full" type="date" />
          </el-form-item>
        </el-col>
        <!-- 接收日期 -->
        <el-col :span="8">
          <el-form-item :style="{ height: '40px' }" label="接收日期：">
            <el-date-picker v-model="patientModel.receiptDate as unknown as Date" class="!w-full" type="date" />
          </el-form-item>
        </el-col>
        <!-- 初始透析次数 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item :style="{ height: '40px' }" label="初始透析次数：" prop="dialysisCountInit">
            <el-input v-model="patientModel.dialysisCountInit" type="number" placeholder="请输入初始透析次数" />
          </el-form-item>
        </el-col>
        <!-- 透析状态 -->
        <el-col :span="8">
          <el-form-item style="height:40px;" label="透析状态：">
            <Dictionary v-model="patientModel.dialysisState" :dic-code="DIC_PATIENT_DIALYSIS_STATE" type="select" />
          </el-form-item>
        </el-col>
        <!-- 主治医生 -->
        <!--   <el-col :span="8">
          <el-form-item style="height:40px;" label="主治医生：">
            <search-table v-model="doctorInfo" type-code="0" />
          </el-form-item>
        </el-col> -->
        <!-- 主管护士 -->
        <!--   <el-col :span="8">
          <el-form-item style="height:40px;" label="主管护士：">
            <search-table v-model="nurseInfo" type-code="1" />
          </el-form-item>
        </el-col> -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item style="height:40px;" label="职业：">
            <Dictionary v-model="patientModel.profession" :dic-code="DIC_PEOPLE_PROFESSION" type="select" />
          </el-form-item>
        </el-col>
        <!-- 文化程度 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item style="height:40px;" label="文化程度：">
            <Dictionary v-model="patientModel.educationalLevel" :dic-code="DIC_PEOPLE_EDUCATIONALLEVEL" type="select" />
          </el-form-item>
        </el-col>
        <!-- 婚否 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item style="height:40px;" label="婚否：">
            <Dictionary v-model="patientModel.marital" :dic-code="DIC_PEOPLE_MARITAL" type="select" />
          </el-form-item>
        </el-col>
        <!-- 身高 -->
        <el-col :span="8">
          <el-form-item style="height:40px;" label="身高：" prop="height">
            <el-input v-model="patientModel.height" type="number" placeholder="请输入身高">
              <template #append>
                CM
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 血型 -->
        <el-col :span="8">
          <el-form-item style="height:40px;" label="血型：">
            <Dictionary v-model="patientModel.bloodType" :dic-code="DIC_PEOPLE_BLOODTYPE" type="select" />
          </el-form-item>
        </el-col>
        <!-- rh -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item style="height:40px;" label="Rh：">
            <Dictionary v-model="patientModel.rh" :dic-code="DIC_PEOPLE_RH" type="select" />
          </el-form-item>
        </el-col>
        <!-- 病情 -->
        <el-col v-if="!isTrue" :span="8">
          <el-form-item style="height:40px;" label="病情：">
            <Dictionary v-model="patientModel.medicareCondition" :dic-code="DIC_PATIENT_CONDITION" type="select" />
          </el-form-item>
        </el-col>
        <!-- 通讯地址 -->
        <el-col v-if="!isTrue" :span="16">
          <el-form-item :style="{ height: '40px' }" label="通讯地址：">
            <el-col :span="14" style="padding-left:0px">
              <el-cascader v-model="mailingAddress" style="width:100%" :options="region" expand-trigger="hover" />
            </el-col>
            <el-col :span="10" style="padding-left:0px;padding-right:0px" prop="Address">
              <el-input v-model="patientModel.address" placeholder="请选择通讯地址" />
            </el-col>
          </el-form-item>
        </el-col>
        <!-- 联系电话 -->
        <el-col :span="8">
          <el-form-item :style="{ height: '40px' }" label="联系电话：" prop="telephone">
            <el-input v-model="patientModel.telephone" type="" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <!-- TODO 患者签名html -->
        <el-col v-if="patient.id" :span="8">
          <el-form-item :style="{ height: '40px' }" label="患者签名：" align="left">
            <div v-if="!patientSignature.signature" class="Diagnosis" style="top: 1px">
              <el-icon @click="handlePatientSignature">
                <CirclePlus />
              </el-icon>
            </div>
            <img :style="{ height: '40px' }" :src="patientSignature.signature" alt="" style="height: 100%" @click="handlePatientSignature">
          </el-form-item>
        </el-col>
        <el-col v-if="paramShowHospitalArea" :span="24">
          <el-form-item :style="{ height: '40px' }" label="院区：" prop="sysHospitalAreaIds">
            <el-select v-model="patientModel.sysHospitalAreaIds" :multiple="true" placeholder="请选择">
              <el-option v-for="item in hospitalAreas" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 工作单位 -->
        <el-col v-if="!isTrue" :span="24">
          <el-form-item :style="{ height: '40px' }" label="工作单位：" prop="WorkUnit">
            <el-input v-model="patientModel.workUnit" placeholder="请输入工作单位" />
          </el-form-item>
        </el-col>
        <!-- 诊断 -->
        <el-col :span="23">
          <el-form-item :style="{ height: '40px' }" label="诊断：" prop="Diagnosis">
            <Dictionary v-model="patientModel.diagnosis" :dic-code="DIC_PATIENT_DIAGNOSIS" type="select" />
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item :style="{ height: '40px' }" label="疾病相关并发症：" prop="Diagnosis">
            <Dictionary v-model="complication" :is-multiple="true" dic-code="DIC.PATIENT.COMPLICATION" type="select" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传染病：">
            <div class="Infectious">
              <el-icon @click="addInfectionsDialog">
                <CirclePlus />
              </el-icon>
            </div>
          </el-form-item>
        </el-col>
        <!-- 传染病种类 -->
        <el-col v-if="infectionTypes.length > 0" :span="12" class="diseaTag">
          <el-form-item label="传染病种类：">
            <el-tag v-for="(item, index) in infectionTypes" :key="index" type="danger" class="mr-1">
              {{ item }}
            </el-tag>
          </el-form-item>
        </el-col>
        <!-- 标签 -->
        <el-col :span="24" style="text-align:left">
          <el-form-item :style="{ height: '40px' }" label="标签：" prop="tags">
            <el-popover placement="bottom-start" width="400" :visible="tagVisible">
              <el-card class="box-card" shadow="never" style="padding:6px;margin:-5px;width:600px" :body-style="{ padding: '10px 20px' }">
                <div class="flex justify-between">
                  <span style="color:#696B6F">{{ '选择模板标签' }}</span>
                  <span @click="tagVisible = false">
                    <el-icon><CircleClose /></el-icon>
                  </span>
                </div>
                <hr style="background: #DCDFE6;height: 1px;border: none;margin-right:-20px;margin-left:-20px;">
                <el-checkbox-group v-model="tagCheckList" size="small" style="line-height:40px;">
                  <el-checkbox v-for="tag in tmplTags" :key="tag.name" :label="tag.name" :value="tag.name" border @change="selectTag">
                    <span :style="{ color: tag.color }">{{ tag.name }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </el-card>
              <el-card class="box-card" shadow="never" style="padding:6px;margin:-5px;margin-top:10px;width:600px" :body-style="{ padding: '10px 20px' }">
                <span style="color:#696B6F">{{ '添加新标签' }}</span>
                <hr style="background: #DCDFE6;height: 1px;border: none;margin-right:-20px;margin-left:-20px;">
                <el-form ref="tagFormRef" :model="tagform" :rules="ruletag" label-width="80px" size="small" style="margin-bottom:-10px;margin-left:-10px;margin-right:-10px;">
                  <el-row>
                    <el-col :span="14">
                      <el-form-item label="名称：" prop="name">
                        <el-input v-model="tagform.name" size="small" placeholder="请输入名称" style="width:160px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="简称：" prop="shortName">
                        <el-input v-model="tagform.shortName" size="small" placeholder="请输入简称" style="width:160px" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="9">
                      <el-form-item label="等级：" prop="level">
                        <el-select v-model="tagform.level" placeholder="级别" style="width:160px" :teleported="false">
                          <el-option v-for="item in levelOptions" :key="item.value" :label="item.name" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" class="custom-color-picker">
                      <el-form-item label="颜色：" prop="color">
                        <el-color-picker v-model="tagform.color" :predefine="predefineColors" size="small" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item>
                        <el-button size="small" @click="addTag(tagFormRef)">
                          {{ '添加' }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-card>
              <template #reference>
                <el-card class="box-card" shadow="never" :style="{ 'border-color': '#DCDFE6', 'width': '100%' }" @click="tagVisible = !tagVisible">
                  <span v-if="dynamicTags?.length === 0" style="color:#C0C4CC;position:relative;top:-45px;">{{ '请选择标签' }}</span>
                  <el-tag
                    v-for="tag in dynamicTags" :key="tag.name" type="info" size="small" closable draggable="true" :disable-transitions="false"
                    :style="{ color: tag.color }"
                  >
                    {{ tag.name }}
                  </el-tag>
                </el-card>
              </template>
            </el-popover>
          </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="patientModel.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col v-if="!isTrue" :span="24">
          <el-form-item label="首次肾脏替代治疗时肾功能(ml/min/1.73m^2)：" label-width="320px">
            <el-input v-model="patientModel.firstGfr" type="number" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- 首次肾脏替代治疗时血肌酐水平 -->
        <el-col v-if="!isTrue" :span="24">
          <el-form-item label="首次肾脏替代治疗时血肌酐水平(umol/L)：" label-width="300px">
            <el-input v-model="patientModel.firstScr" type="number" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- 首次透析时采用的通路类型 -->
        <el-col :span="24">
          <el-form-item label="首次透析时采用的通路类型：" prop="firstDialysisVascularAccess" label-width="220px">
            <el-radio-group v-model="patientModel.firstDialysisVascularAccess">
              <el-radio v-for="item in firstDialysisVascularAccessOptions" :key="item" :value="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 首次透析时采取的方式 -->
        <el-col :span="24">
          <el-form-item label="首次透析时采取的方式：" prop="firstDialysisMode" label-width="200px">
            <el-radio-group v-model="patientModel.firstDialysisMode">
              <el-radio v-for="item in firstDialysisModeOptions" :key="item" :value="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <Addinfectious :show-addinfections="showAddinfections" :form-infectiou="formModel" @save-infectious="saveInfectious" @close-add-infections="infectionsDialog" />
  <el-dialog v-model="showPatientSignature" title="患者签名" width="70%" append-to-body :close-on-click-modal="false" @close="closeSignatureDialog">
    <VueSignaturePad
      ref="signaturePad" :options="signOptions" height="400px" :max-width="8"
      :min-width="4" style="border:1px solid #DCDFE6;"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClearSignature">
          清 除
        </el-button>
        <el-button type="primary" :loading="showSignatureLoading" @click="handleSaveSignature">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { CircleClose, CirclePlus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { showNotify } from 'vant'
import { useAppStore } from '@/stores'
import { getToken } from '@/utils/auth'
import region from '@/assets/json/Region.json'
import { type IPatientDiagnosisInfectiousDiseasesView, PatientSignatureEditModel, type PatientTagsBase } from '@/services/PatientServiceProxies'

import { PatientDiagnosisInfectiousDiseasesItemView, PatientServiceProxy, PatientSignatureServiceProxy, PatientView } from '@/services/PatientServiceProxies'
import type { FormInstance, FormRules } from 'element-plus'
import { DIC_PATIENT_CONDITION, DIC_PATIENT_DIAGNOSIS, DIC_PATIENT_DIALYSIS_STATE, DIC_PATIENT_SOURCE, DIC_PEOPLE_BLOODTYPE, DIC_PEOPLE_EDUCATIONALLEVEL, DIC_PEOPLE_GENDER, DIC_PEOPLE_IDTYPE, DIC_PEOPLE_IDTYPE_IDCARD, DIC_PEOPLE_MARITAL, DIC_PEOPLE_MEDICARETYPE, DIC_PEOPLE_NATIONALITY, DIC_PEOPLE_PROFESSION, DIC_PEOPLE_RH } from '@/utils/constant'
import type { TmplPatientTags } from '@/services/TmplServiceProxies'
import { PinyinWubiCodeServiceProxy } from '@/services/WebApiServiceProxies'

const { patient, hospitalAreas, dynamicTags, tmplTags } = defineProps({
  patient: PatientView,
  hospitalAreas: { type: Array<hospitalArea> },
  dynamicTags: { type: Array<PatientTagsBase> },
  tmplTags: { type: Array<TmplPatientTags> },
})

const emit = defineEmits(['updatePatient', 'updateDynamicTags'])
const patientServiceProxy = new PatientServiceProxy()
const patientSignatureServiceProxy = new PatientSignatureServiceProxy()
const pinyinWubiCodeServiceProxy = new PinyinWubiCodeServiceProxy()

const { getParametersValue } = useAppStore()
interface hospitalArea {
  value: string
  label: string
}
interface RuleForm {
  level: string
  name: string
  shortName: string
  color: string
}
const formModel = ref<PatientDiagnosisInfectiousDiseasesItemView>(new PatientDiagnosisInfectiousDiseasesItemView())
const ruleFormRef = ref<FormInstance>()
const patientModel = ref<PatientView>(new PatientView()) // 透前测量表单数据
const tagFormRef = ref<FormInstance>()
const tagform = reactive<RuleForm>({
  level: '',
  name: '',
  shortName: '',
  color: '',
})
const firstDialysisVascularAccessOptions = ['临时中心静脉置管', '长期中心静脉置管', '自体内瘘', '移植血管', '动静脉直接穿刺', '腹膜透析', '其它']
const firstDialysisModeOptions = ['透析室常规门诊诱导透析', '急诊室紧急透析或CRRT', '住院期间透析室诱导透析', '住院期间紧急透析或CRRT', '腹膜透析', '其它']
const mailingAddress = ref([])
const tagCheckList = ref([])
const ruletag = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'change' },
    { max: 32, message: '不能超过32个字符', trigger: 'change' },
  ],
  shortName: [
    { required: true, message: '请输入简称', trigger: 'change' },
    { max: 2, message: '不能超过2个字符', trigger: 'change' },
  ],
  level: [
    { required: true, message: '请选择等级', trigger: 'change' },
  ],
  color: [
    { required: true, message: '请选择颜色', trigger: 'change' },
  ],
})
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
]
const levelOptions = [{
  value: '1',
  name: '一级',
}, {
  value: '2',
  name: '二级',
}, {
  value: '3',
  name: '三级',
}]

const patientSignature = ref<PatientSignatureEditModel>(new PatientSignatureEditModel())
const loading = ref(true)
const showPatientSignature = ref(false)
const showSignatureLoading = ref(false)
const showAddinfections = ref(false)
const hospitalization = ref(true)
const tagVisible = ref(false)
const signaturePad = ref()
const complication = ref('')
const patientSignatureIdId = ref()
const infectious = ref<IPatientDiagnosisInfectiousDiseasesView>({
  items: [], // 诊断详情
  diagnosis: 1, // 诊断类型(0:无,1:有)
})
const infectionTypes = ref([])
const isTrue = false
const paramShowHospitalArea = getParametersValue('SYS.HOSPITAL.AREA', true)
const signOptions = ref({
  minWidth: 2, // 画笔最小宽度
  maxWidth: 5, // 画笔最大宽度
  throttle: 5, // 画笔移动事件的时间间隔，单位为毫秒
  minDistance: 5, // 画笔移动的最小距离，单位为像素
  backgroundColor: 'rgba(218, 215, 215, 0.829)', // 画布背景颜色
  penColor: 'black', // 画笔颜色
  velocityFilterWeight: 0.7, // 画笔速度过滤器的权重
  onBegin: () => {
    // signaturePad.value.resizeCanvas()
  }, // 开始签名时的回调函数
  onEnd: () => {
    console.log('=== End ===')
  }, // 结束签名时的回调函数
})
const formRules = reactive<FormRules<PatientView>>({
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'change',
    },
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  name2: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  pinyinCode: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  wubiCode: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  idNumber: [
    {
      validator: validateID,
      trigger: 'change',
    },
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  ward: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  bed: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  hospitalNumberOut: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  hospitalNumberIn: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  medicareNumber: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  cardNumber: [
    {
      max: 16,
      message: '不能超过16个字符',
      trigger: 'change',
    },
  ],
  dialysisNumber: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  dialysisCountInit: [
    {
      max: 5,
      validator: validateCountInit,
      trigger: 'change',
    },
  ],
  dialysisCountTotal: [
    {
      max: 5,
      validator: validateCountTotal,
      trigger: 'change',
    },
  ],
  telephone: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  rh: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  medicareCondition: [
    {
      max: 32,
      message: '不能超过32个字符',
      trigger: 'change',
    },
  ],
  dossierNumber: [
    {
      max: 128,
      message: '不能超过128个字符',
      trigger: 'change',
    },
  ],
  address: [
    {
      max: 64,
      message: '不能超过64个字符',
      trigger: 'change',
    },
  ],
  workUnit: [
    {
      max: 128,
      message: '不能超过128个字符',
      trigger: 'change',
    },
  ],
  remark: [
    {
      max: 512,
      message: '不能超过512个字符',
      trigger: 'change',
    },
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change',
    },
  ],
  source: [
    {
      required: true,
      message: '请选择来源',
      trigger: 'change',
    },
  ],
  sysHospitalAreaIds: [
    {
      required: true,
      validator: validateHospitalArea,
      trigger: 'change',
    },
  ],
  height: [
    { validator: validateHeight, trigger: 'change' },
  ],
  firstDialysisVascularAccess: [
    { required: true, message: '请选择首次透析时采用的通路类型', trigger: 'blur' },
  ],
  firstDialysisMode: [
    { required: true, message: '请选择首次透析时采取的方式', trigger: 'blur' },
  ],
})
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
/* 监听患者数据变化 */
watch(
  () => patient,
  (newVal) => {
    patientModel.value = newVal
    mailingAddress.value = [
      patientModel.value.province,
      patientModel.value.city,
      patientModel.value.area,
    ]
    complication.value = patientModel.value.complication
    infectious.value = { ...patientModel.value.infectious }
    if (patientModel.value.infectious.items.length > 0) {
      infectionTypes.value = patientModel.value.infectious.items[0].typeLabel.split(';') // 传染病种类 //
      formModel.value = Object.assign({ }, patientModel.value.infectious.items[0])
    }
    else {
      if (!formModel.value.type) {
        formModel.value.patientId = patient.id
        formModel.value.date = dayjs()
      }
    }
  },
  { immediate: true, deep: true },
)
watch(
  () => dynamicTags,
  (newVal) => {
    if (newVal)
      tagCheckList.value = newVal.map(item => item.name)
  },
  { immediate: true, deep: true },
)

function validateID(_rule, value, callback) {
  if (
    patientModel.value.idType === DIC_PEOPLE_IDTYPE_IDCARD
    && value !== ''
  ) {
    if (
      !/^[1-9]\d{5}(?:18|19|[23]\d)\d{2}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{3}[0-9X]$|^[1-9]\d{7}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{3}$/i.test(
        value,
      )
    ) {
      callback(
        new Error(
          '证件号码格式不正确',
        ),
      )
    }
    else {
      callback()
    }
  }
  else {
    callback()
  }
}
function validateHeight(_rule, value, callback) {
  if (value > 200 || value < 100) {
    callback(
      new Error(
        '请输入100-200之间的数字',
      ),
    )
  }
  else {
    callback()
  }
}
function validateHospitalArea(_rule, value, callback) {
  if (!value.includes(getToken().hid)) {
    callback(
      new Error(
        '至少选中当前院区',
      ),
    )
  }
  else {
    callback()
  }
}
function validateCountInit(_rule, value, callback) {
  if (value !== '' && value !== null && value !== undefined) {
    if (String(value).length > 5) {
      callback(new Error('不能超过5个字符'))
    }
    else if (Number.parseInt(value) < 0) {
      callback(new Error('不能小于0'))
    }
    else {
      callback()
    }
  }
  else {
    callback()
  }
}
function validateCountTotal(_rule, value, callback) {
  if (value !== '' && value !== null && value !== undefined) {
    if (String(value).length > 5) {
      callback(new Error('不能超过5个字符'))
    }
    else if (Number.parseInt(value) < 0) {
      callback(new Error('不能小于0'))
    }
    else {
      callback()
    }
  }
  else {
    callback()
  }
}
async function getCode() {
  const { success, data } = await pinyinWubiCodeServiceProxy.pinyinWubiCode(patientModel.value.name)
  if (success) {
    patientModel.value.pinyinCode = data.pinyinCode
    patientModel.value.wubiCode = data.wubiCode
  }
}
function handlePatientSignature() {
  showPatientSignature.value = true
  const data = patientSignature.value.signature
  nextTick(() => {
    signaturePad.value.resizeCanvas()
    signaturePad.value.fromDataURL(data)
  })
}
function closeSignatureDialog() {
  signaturePad.value.clearSignature()
}
function handleClearSignature() {
  signaturePad.value.clearSignature()
}
/* 获得患者签名信息 */
async function fetchPatientSignature() {
  const filters = {
    pageIndex: 1,
    pageSize: 10,
    PatientId: { value: patient.id, type: '=' },
  }
  const { success, data } = await patientSignatureServiceProxy.filterGET42(JSON.stringify(filters), undefined)
  if (success && data.length) {
    patientSignature.value = Object.assign(patientSignature.value, data?.[0])
    patientSignatureIdId.value = data?.[0].id
  }
  else {
    // showNotify({ type: 'danger', message })
  }
}
async function handleSaveSignature() {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (!isEmpty) {
    showSignatureLoading.value = true
    const saveData = Object.assign(patientSignature.value, { signature: data, patientId: patient.id, id: patientSignatureIdId.value })
    const { success } = !saveData.id ? await patientSignatureServiceProxy.patientSignaturePOST2(saveData) : await patientSignatureServiceProxy.patientSignaturePOST(saveData.id, saveData)
    if (success) {
      fetchPatientSignature()
    }
    showSignatureLoading.value = false
    showPatientSignature.value = false
  }
}
async function addTag(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const tmpl = tmplTags.filter(c => c.name === tagform.name)
      if (tmpl.length === 0) {
        const tag = dynamicTags.filter(t => t.name === tagform.name)
        if (tag.length === 0) {
          const dynamicTag: any = []
          tagCheckList.value.forEach((check) => {
            const tag = tmplTags.filter(t => t.name === check)
            if (tag.length) {
              dynamicTag.push(tag[0])
            }
          })
          dynamicTag.push({
            name: tagform.name,
            shortName: this.tagform.shortName,
            level: tagform.level,
            color: tagform.color,
          })
          emit('updateDynamicTags', dynamicTag)
        }
      }
      else {
        showNotify({ type: 'danger', message: '请从模板中选择此标签' })
      }
      formEl.resetFields()
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
function selectTag() {
  const dynamicTag: any = []
  tagCheckList.value.forEach((check) => {
    const tag = tmplTags.filter(t => t.name === check)
    if (tag.length) {
      dynamicTag.push(tag[0])
    }
    else {
      const otherTag = dynamicTags.filter(t => t.name === check)
      if (otherTag.length) {
        dynamicTag.push(otherTag[0])
      }
    }
  })
  emit('updateDynamicTags', dynamicTag)
}
/* 保存传染病 */
function saveInfectious(model, name) {
  formModel.value = model
  infectionTypes.value = name.split(';')
  const disease = model.type.replace(/,/g, ';')
  formModel.value.type = disease
  infectious.value.items = JSON.parse(JSON.stringify([formModel.value]))
  showAddinfections.value = false
}
function saveForm() {
  submitForm(ruleFormRef.value)
}
/* 保存患者基本信息 */
async function submitForm(ruleFormRef: FormInstance | undefined) {
  if (!ruleFormRef)
    return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      if (mailingAddress.value.length > 0) {
        patientModel.value.province = mailingAddress.value[0]
        patientModel.value.city = mailingAddress.value[1]
        patientModel.value.area = mailingAddress.value[2]
      }
      patientModel.value.complication = complication.value
      patientModel.value.infectious.diagnosis = infectious.value.diagnosis
      patientModel.value.infectious.items = infectious.value.items
      patientModel.value.tags = dynamicTags
      savePatient()
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
const imagelist = ref([])

async function savePatient() {
  const { success, message } = await patientServiceProxy.patientPOST(patient.id, toRaw(patientModel.value))
  if (success) {
    emit('updatePatient', patientModel.value)
    showNotify({ type: 'success', message: '保存成功' })
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
function addInfectionsDialog() {
  showAddinfections.value = true
}
function infectionsDialog() {
  showAddinfections.value = false
}
function changeSource() {
  const source = patientModel.value.source
  if (source === 'INPATIENT') {
    hospitalization.value = false
    patientModel.value.department = ''
  }
  else {
    hospitalization.value = true
    patientModel.value.ward = ''
  }
}

onMounted(() => {
  console.log('yuahjknc', getToken())
  fetchPatientSignature()
})

defineExpose({
  saveForm,
})
</script>

<style scoped lang="less">
.Diagnosis {
  font-size: 25px;
  font-weight: 600;
  display: inline-block;
  color: #1989fa;
  padding-right: 15px;
  text-align: left;
  position: relative;
  top: 4px;
  right: 5px;
}
.Infectious {
  font-size: 25px;
  font-weight: 600;
  color: #1989fa;
  padding-right: 15px;
  text-align: left;
}
::v-deep .el-card__body {
  padding: 0px !important;
}
.custom-color-picker::v-deep .el-color-picker__panel {
  z-index: 9999 !important; /* 设定你需要的z-index值 */
}
</style>
