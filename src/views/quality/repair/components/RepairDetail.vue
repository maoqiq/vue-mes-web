<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="repair" :rules="rules" ref="repairFrom" label-width="150px">
      <el-form-item label="维修单编号：" prop="repairId">
        <el-input v-model="repair.repairId"></el-input>
      </el-form-item>
      <el-form-item label="维修单类型：" prop="type">
        <el-checkbox-group class="repair-checkbox" v-model="repair.checkList" @change="handleChange">
          <el-checkbox :label="item.label" v-for="item of repairTypeList" :key="item.label"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="维修单明细：" prop="detail">
        <el-select v-model="repair.detail" placeholder="请选择机器号" clearable>
          <el-option
            v-for="item in 5"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维修内容：">
        <el-input
          placeholder="请输入维修内容"
          type="textarea"
          :rows="3"
          v-model="repair.text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('repairFrom')">报修</el-button>
        <el-button v-if="!isEdit" @click="resetForm('repairFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createBrand, getBrand, updateBrand} from '@/api/brand'
  import SingleUpload from '@/components/Upload/singleUpload'
  const defaultRepair={
    repairId: '',
    checkList: [],
    detail: '',
    text: ''
  };
  export default {
    name: 'BrandDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        repair:Object.assign({}, defaultRepair),
        rules: {
          // name: [
          //   {required: true, message: '请输入品牌名称', trigger: 'blur'},
          //   {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          // ],
          // logo: [
          //   {required: true, message: '请输入品牌logo', trigger: 'blur'}
          // ],
          // sort: [
          //   {type: 'number', message: '排序必须为数字'}
          // ]
        },
        checkList: [],
        repairTypeList: [
          {
            label: '机器'
          },
          {
            label: '纱锭'
          },
          {
            label: '其他'
          }
        ]
      }
    },
    created() {
      if (this.isEdit) {
        // getBrand(this.$route.query.id).then(response => {
        //   this.repair = response.data;
        // });
      }else{
        this.repair = Object.assign({}, defaultRepair);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                // updateBrand(this.$route.query.id, this.brand).then(response => {
                //   this.$refs[formName].resetFields();
                //   this.$message({
                //     message: '修改成功',
                //     type: 'success',
                //     duration:1000
                //   });
                //   this.$router.back();
                // });
              } else {
                // createBrand(this.brand).then(response => {
                //   this.$refs[formName].resetFields();
                //   this.brand = Object.assign({},defaultBrand);
                //   this.$message({
                //     message: '提交成功',
                //     type: 'success',
                //     duration:1000
                //   });
                // });
              }
              this.$router.push({path:'/quality/repair'});
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.brand = Object.assign({}, defaultRepair);
      },
      handleChange(arr){
        if(arr.length > 1){
          arr.shift()
        }
      }
    }
  }
</script>
<style>
</style>


