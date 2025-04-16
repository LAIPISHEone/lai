
<template>
    <div>
        <el-form label-width="120px">
            <el-form-item label="待转换数字：">
                <el-input style="width: 200px;" @input="convert" v-model="inputNumber" placeholder="在此输入待转换数字"></el-input>

            </el-form-item>
            <el-form-item label="源进制：">
                <el-select @change="convert" v-model="sourceBase" placeholder="请选择源进制">
        <el-option label="二进制" value="2"></el-option>
        <el-option label="八进制" value="8"></el-option>
        <el-option label="十进制" value="10"></el-option>
        <el-option label="十六进制" value="16"></el-option>
      </el-select>
            </el-form-item>
            <el-form-item label="目标进制：">
                <el-select v-model="targetBase"  @change="convert" placeholder="请选择目标进制">
        <el-option label="二进制" value="2"></el-option>
        <el-option label="八进制" value="8"></el-option>
        <el-option label="十进制" value="10"></el-option>
        <el-option label="十六进制" value="16"></el-option>
      </el-select>
            </el-form-item>
            <el-form-item label="转换结果：">
                <el-input-group>
        <el-input style="width: 200px;" v-model="result" placeholder="转换结果" readonly></el-input>
        <el-button @click="handleCopy(result)" icon="el-icon-document-copy"></el-button>
      </el-input-group>
            </el-form-item>

        </el-form>
    
    
    </div>
  </template>
  
  <script>
  import { handleCopy } from '../../utils/copy';
  export default {
    data() {
      return {
        handleCopy,
        sourceBase: '10', // 默认源进制为十进制
        targetBase: '16', // 默认目标进制为十六进制
        inputNumber: '', // 待转换的数字
        result: '' // 转换结果
      };
    },
    methods: {
        
      handleTabClick(tab) {
        this.sourceBase = tab.name;
      },
      convert() {
        let num = parseInt(this.inputNumber, this.sourceBase);
        if (isNaN(num)) {
          this.result = '请输入有效的数字';
          return;
        }
        this.result = num.toString(this.targetBase).toUpperCase();
      },

    }
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要调整 */
  </style>