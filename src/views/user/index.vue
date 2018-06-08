<template>
  <div class="user-container">
    <el-row>
      <el-col :xs="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <div>
            <div style="float: left; margin-right: 10px;">
              <img :src="avatar" width="70px" style="border-radius: 70px;"/>
            </div>
            <div style="">
              <p>用户名：{{name}} </p>
              <p><el-tag size="medium" :type="statusType">{{statusLabel}}</el-tag></p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12" v-show="status == 1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>专属二维码</span>
          </div>
          <div>
            <qrcode :val="qrcodeUrl" :size="100"> </qrcode>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span>认证信息</span>
          <el-tag size="medium" type='info'> {{certifiedInfo.statusLabel}} </el-tag>
        </div>
        <div class="banner-box">
          <div v-show="certifiedInfo.status === 1" >
            <label class="error-msg"> {{certifiedInfo.errorMsg}} </label>
          </div>
          <el-form label-position="top" v-loading="certLoding" label-width="80px" :rules="certifiedInfRules" ref="certifiedInfoFrom" :model="certifiedInfo" :disabled="certDisabled">
            <el-form-item label="客栈名称" prop="title">
              <el-input v-model="certifiedInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="客栈地址" prop="address">
              <el-input v-model="certifiedInfo.address"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名" prop="idCardName">
              <el-input v-model="certifiedInfo.idCardName"></el-input>
            </el-form-item>
            <el-form-item label="证件号码" prop="idCardNumber">
              <el-input v-model="certifiedInfo.idCardNumber"></el-input>
            </el-form-item>
            <el-form-item label="证件照片" prop="idCardPic">
              <el-upload
                class="idcard-uploader"
                action="https://up-z2.qiniup.com"
                :multiple="true"
                :data="idcardPicUploadData"
                :show-file-list="false"
                :on-success="handleIDCardUpdateSuccess"
                :before-upload="idCardPicBeforeUpload"
                >
                <img v-if="certifiedInfo.idCardPic" :src="certifiedInfo.idCardPic" class="idcard">
                <i v-else class="el-icon-plus idcard-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-loading="submitLoding" @click="submitVerify('certifiedInfo')">提交审核</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
// import { QRCode } from 'qrcode'
import qrcode from '@/components/Qrcode'
import { getToken } from '@/api/qiniu'
import { submitCert, getCertInfo } from '@/api/user'
export default {
  name: 'user',
  data() {
    return {
      certLoding: false,
      submitLoding: false,
      certifiedInfo: {
        title: '',
        address: '',
        idCardName: ' ',
        idCardNumber: '',
        idCardPic: '',
        status: -1,
        statusLabel: '',
        errorMsg: ''
      },
      idcardPicUploadData: { token: '', key: '' },
      certifiedInfRules: {
        title: [
          { required: true, message: '请输入客栈名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入客栈地址', trigger: 'blur' }
        ],
        idCardName: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' }
        ],
        idCardNumber: [
          { required: true, message: '请输入法人身份证号', trigger: 'blur' }
        ],
        idCardPic: [
          { required: true, message: '请上传法人身份证照片', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    qrcode
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'status',
      'statusLabel',
      'qrcodeUrl'
    ]),
    statusType: function() {
      return this.status === 1 ? 'success' : 'danger'
    },
    certDisabled: function() {
      return this.certifiedInfo.status === 0 || this.certifiedInfo.status === 2
    }
  },

  created() {
    this.fetchCertInfo()
  },

  methods: {

    fetchCertInfo() {
      this.certLoding = true
      getCertInfo().then(response => {
        this.certifiedInfo = response.obj
      }).finally(() => {
        this.certLoding = false
      })
    },

    idCardPicBeforeUpload(file) {
      const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isImage) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(data => {
          const key = data.obj.key
          const token = data.obj.token
          _self._data.idcardPicUploadData.token = token
          _self._data.idcardPicUploadData.key = key
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },

    handleIDCardUpdateSuccess(res, file) {
      this.certifiedInfo.idCardPic = 'http://p9ivv4bss.bkt.clouddn.com/' + res.key
    },

    submitVerify() {
      const msg = {
        title: '请输入客栈名称',
        address: '请输入客栈地址',
        idCardName: '请输入法人姓名',
        idCardNumber: '请输入法人身份证号',
        idCardPic: '请上传法人身份证照片'
      }
      const submitCertFrom = Object.assign({}, this.certifiedInfo)
      for (const key in submitCertFrom) {
        if (['status', 'statusLabel', 'errorMsg'].includes(key)) {
          delete submitCertFrom[key]
        } else if (!submitCertFrom[key] && typeof submitCertFrom[key] === 'string' && submitCertFrom[key].trim() === '') {
          this.$message.error(msg[key])
        }
      }
      this.submitLoding = true
      submitCert(submitCertFrom).then(response => {
        console.log(response.obj.id)
        this.$message({ message: '提交成功，平台将会在1个工作日内审核，请耐心等待。', type: 'success' })
        this.fetchCertInfo()
      }).finally(() => {
        this.submitLoding = false
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.box-card {
  margin: 10px
}

.idcard-uploader {
    width: 200px;
    height: 300px;
    border: 1px dashed #8c939d;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.idcard-uploader:hover {
  border-color: #409EFF;
}

.idcard-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 200px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}

.idcard {
  width: 200px;
  height: 300px;
  display: block;
}

.error-msg {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px;
  left: 0;
}
</style>
