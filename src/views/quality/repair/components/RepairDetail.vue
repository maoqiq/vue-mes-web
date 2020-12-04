<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="createRepairParams" :rules="rules" ref="repairFrom" label-width="150px">
      <el-form-item label="维修单类型：" prop="maintenance_type">
        <el-select v-model="createRepairParams.maintenance_type" placeholder="请选择维修单类型" @change="typeChange" clearable>
          <el-option
            v-for="item in repairTypeList"
            :key="item.label"
            :label="item.maintenance_type"
            :value="item.maintenance_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="createRepairParams.maintenance_type=='机器'" label="维修单明细：" prop="machine_id">
        <el-select v-model="createRepairParams.machine_id" placeholder="请选择气流纺机" clearable>
          <el-option
            v-for="item in machineOptions"
            :key="item.device_id"
            :label="item.device_name"
            :value="item.device_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else-if="createRepairParams.maintenance_type=='纱锭'" label="维修单明细：" prop="rot_id">
        <el-select v-model="createRepairParams.machine_id" placeholder="请选择气流纺机" clearable>
          <el-option
            v-for="item in machineOptions"
            :key="item.device_id"
            :label="item.device_name"
            :value="item.device_id">
          </el-option>
        </el-select>
        <el-input style="width: 203px" v-model="createRepairParams.rot_id" placeholder="请输入纱锭编号"></el-input>
      </el-form-item>
      <el-form-item v-else label="维修单明细：" prop="maintenance_detail">
        <el-input style="width: 203px" v-model="createRepairParams.maintenance_detail" placeholder="请输入维修明细"></el-input>
      </el-form-item>
      <el-form-item label="维修内容：" prop="remarks">
        <el-input
          placeholder="请输入维修内容"
          type="textarea"
          :rows="3"
          v-model="createRepairParams.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('repairFrom')">报修</el-button>
        <el-button v-if="!isEdit" @click="resetForm('repairFrom')">重置</el-button>
        <el-button v-if="!isEdit" @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import { machineDropDown } from '@/api/machinePanelList'
  import { getRepairTypeList,createRepair } from '@/api/repairInfo'
  const defaultRepair={
    maintenance_type: '机器',
    maintenance_detail: '',
    remarks: '',
    machine_id: '',
    rot_id: ''
  };
  export default {
    name: 'BrandDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        createRepairParams:Object.assign({}, defaultRepair),
        rules: {
          maintenance_type: {required: true, message: '请选择维修单类型', trigger: 'blur'},
          machine_id: {required: true, message: '请选择气流纺机', trigger: 'blur'},
          rot_id: {required: true, message: '请选择气流纺机并输入纱锭编号', trigger: 'blur'},
          maintenance_detail: {required: true, message: '请完善维修单明细', trigger: 'blur'}
        },
        machineOptions: [],
        repairTypeList: []
      }
    },
    created() {
      this.getMachineDropDownList();
      this.getRepairDropDownList();
      if (this.isEdit) {
        // getBrand(this.$route.query.id).then(response => {
        //   this.createRepairParams = response.data;
        // });
      }else{
        this.createRepairParams = Object.assign({}, defaultRepair);
      }
    },
    methods: {
      getMachineDropDownList() {
        this.machineOptions = [];
        machineDropDown().then(response => {
          this.machineOptions = response.result;
        });
      },
      getRepairDropDownList(){
        getRepairTypeList().then(response => {
          console.log(response)
          this.repairTypeList = response.result;
        });
      },
      typeChange(event){
        this.createRepairParams = Object.assign({}, defaultRepair)
        this.createRepairParams.maintenance_type = event
        console.log(this.createRepairParams)
      },
      handleParams(){
        switch (this.createRepairParams.maintenance_type) {
          case '机器':
            this.createRepairParams.maintenance_detail = `${this.createRepairParams.machine_id}号纺机`
            break;
          case '纱锭':
            this.createRepairParams.maintenance_detail = `${this.createRepairParams.rot_id}号纱锭 - ${this.createRepairParams.machine_id}号纺机`
            break;
          default:
            break;
        }
      },
      onSubmit() {
        this.$refs.repairFrom.validate((valid) => {
          if (valid) {
            if (this.isEdit) {

            } else {
              this.handleParams()
              console.log(this.createRepairParams)
              createRepair(this.createRepairParams).then(response => {
                // this.createRepairParams = Object.assign({}, defaultRepair)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration:1000
                });
              });
            }
            // this.$refs['repairFrom'].resetFields();
            this.$router.push({path:'/quality/repair'});
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
      goBack(){
        this.$router.go(-1);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.createRepairParams = Object.assign({}, defaultRepair);
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


