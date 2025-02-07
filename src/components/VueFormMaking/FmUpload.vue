<template>
  <div :id="uploadId" class="fm-uplaod-container">
    <div
      v-for="item in computedFileList"
      :id="item.key"
      :key="item.key"
      :style="{ width: `${width}px`, height: `${height}px` }"
      :class="{ 'uploading': item.status === 'uploading', 'is-success': item.status === 'success' }"
      class="upload-file"
    >
      <img :src="item.url">
      <el-progress
        v-if="item.status === 'uploading'"
        :width="miniWidth * 0.9"
        class="upload-progress"
        type="circle"
        :percentage="item.percent"
      />
      <label v-if="item.status === 'success'" class="item-status">
        <i class="el-icon-upload-success el-icon-check" />
      </label>
      <div class="uplaod-action">
        <i class="el-icon-view" :style="{ 'font-size': `${miniWidth / 4}px` }" @click="handlePreviewFile(item.key)" />
        <i class="el-icon-delete" :style="{ 'font-size': `${miniWidth / 4}px` }" @click="handleRemove(item.key)" />
      </div>
    </div>
    <div v-show="computedFileList.length < length" class="el-upload el-upload--picture-card" :style="{ width: `${width}px`, height: `${height}px` }">
      <el-icon
        class="el-icon-plus"
        :style="{
          fontSize: `${miniWidth / 4}px`,
          marginTop: `${-miniWidth / 8}px`,
          marginLeft: `${-miniWidth / 8}px`,
        }"
      >
        <Plus />
      </el-icon>
      <input ref="uploadInput" accept="image/*" multiple type="file" :style="{ width: `${width}px`, height: `${height}px` }" name="file" class="el-upload__input upload-input" @change="handleChange">
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  token: {
    type: String,
    default: '',
  },
  domain: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  length: {
    type: Number,
    default: 9,
  },
})

const emit = defineEmits(['input', 'update:modelValue'])

const uploadId = ref('')
const uploadInput = ref(null)

const miniWidth = computed(() => {
  return props.width > props.height ? props.height : props.width
})

// 计算属性 fileList
const computedFileList = computed(() => {
  return props.modelValue?.map(item => ({
    key: item.key ? item.key : `${new Date().getTime()}_${Math.ceil(Math.random() * 99999)}`,
    url: item.url,
    percent: item.percent ? item.percent : 100,
    status: item.status ? item.status : 'success',
  })) || []
})

async function updateMessage() {
  uploadId.value = `upload_${new Date().getTime()}`
  await nextTick()
}

function handleChange() {
  const files = uploadInput.value.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    const key = `${new Date().getTime()}_${Math.ceil(Math.random() * 99999)}`

    reader.readAsDataURL(file)
    reader.onload = () => {
      const newFile = {
        key,
        url: reader.result,
        percent: 0,
        status: 'uploading',
      }

      emit('update:modelValue', [...props.modelValue, newFile])

      nextTick(() => {
        uplaodAction(reader.result, file, key)
      })
    }
  }
  uploadInput.value.value = ''
}

function uplaodAction(res, file, key) {
  const xhr = new XMLHttpRequest()
  const url = '/hfs/upload'
  xhr.open('POST', url, true)
  const formData = new FormData()
  formData.append('file', file)
  xhr.send(formData)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const resData = JSON.parse(xhr.response)
      if (resData && resData.url) {
        const updatedList = computedFileList.value.map((item) => {
          if (item.key === key) {
            return {
              ...item,
              url: resData.url,
              percent: 100,
              status: 'success',
            }
          }
          return item
        })
        emit('update:modelValue', updatedList)
      }
      else {
        const updatedList = computedFileList.value.filter(item => item.key !== key)
        emit('update:modelValue', updatedList)
      }
    }
  }
  xhr.onprogress = (res) => {
    if (res.total && res.loaded) {
      const updatedList = computedFileList.value.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            percent: (res.loaded / res.total) * 100,
          }
        }
        return item
      })
      emit('update:modelValue', updatedList)
    }
  }
}

function handleRemove(key) {
  const updatedList = computedFileList.value.filter(item => item.key !== key)
  emit('update:modelValue', updatedList)
}

function handlePreviewFile(key) {
  if (viewer.value)
    viewer.value.destroy()
  uploadId.value = `upload_${new Date().getTime()}`
  nextTick(() => {
    viewer.value = new Viewer(document.getElementById(uploadId.value))
    viewer.value.view(computedFileList.value.findIndex(item => item.key === key))
  })
}

watch(
  () => props.modelValue,
  () => {
    updateMessage()
  },
  { immediate: true },
)
</script>

<style lang="less">
.fm-uplaod-container {
  .upload-file {
    margin: 0 10px 10px 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    position: relative;
    vertical-align: top;

    &:hover {
      .uplaod-action {
        display: flex;
      }
    }

    .uplaod-action {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      justify-content: center;
      align-items: center;

      i {
        color: #fff;
        cursor: pointer;
        margin: 0 5px;
      }
    }

    &.is-success {
      .item-status {
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

        & > i {
          font-size: 12px;
          margin-top: 11px;
          color: #fff;
          transform: rotate(-45deg);
        }
      }
    }

    &.uploading {
      &:before {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
      }
    }

    .upload-progress {
      position: absolute;

      .el-progress__text {
        color: #fff;
        font-size: 16px !important;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .el-upload--picture-card {
    position: relative;
    overflow: hidden;
    background: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;

    .el-icon-plus {
      position: absolute;
      top: 50%;
      left: 50%;
      color: #8c939d;
    }
  }

  .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
