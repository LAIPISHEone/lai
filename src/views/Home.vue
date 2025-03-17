<template>
  <div class="home">
    <div class="search-bar">
      <el-input
        placeholder="搜索课程名称..."
        prefix-icon="el-icon-search"
        v-model="searchText"
        clearable
        @clear="handleSearchClear"
      >
      </el-input>
      <div class="search-stats" v-if="searchText">
        找到 {{ filteredCards.length }} 个相关课程
      </div>
    </div>
    <div class="subject-cards">
      <el-row :gutter="20">
        <!-- 现有学科卡片 -->
        <template v-if="filteredCards.length > 0">
          <el-col :span="8" v-for="(card, index) in filteredCards" :key="index">
            <el-card class="subject-card" :class="card.type" shadow="hover">
              <div class="card-actions">
                <el-button 
                  type="text" 
                  icon="el-icon-edit" 
                  @click.stop="editCard(getOriginalIndex(card))"
                ></el-button>
                <el-button 
                  type="text" 
                  icon="el-icon-delete" 
                  @click.stop="deleteCard(getOriginalIndex(card))"
                ></el-button>
              </div>
              <div class="subject-title">
                {{ card.title }}
                <el-tag 
                  v-if="searchText && isMatchingTitle(card)" 
                  size="mini" 
                  type="warning"
                  class="match-tag"
                >匹配</el-tag>
              </div>
              <div class="subject-desc">{{ card.description }}</div>
              <div class="subject-tags">
                <el-tag 
                  size="small" 
                  :type="card.tagType" 
                  v-for="(tag, tagIndex) in card.tags" 
                  :key="tagIndex"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="card-bg" :class="card.type + '-bg'"></div>
            </el-card>
          </el-col>
        </template>
        <template v-else-if="searchText">
          <el-col :span="24">
            <el-empty 
              description="没有找到相关课程"
              :image-size="200"
            >
              <el-button type="primary" @click="handleSearchClear">清除搜索</el-button>
            </el-empty>
          </el-col>
        </template>
        
        <!-- 添加新卡片按钮 -->
        <el-col :span="8" v-if="!searchText || filteredCards.length > 0">
          <div class="add-card" @click="showAddCardDialog">
            <i class="el-icon-plus"></i>
            <span>新增课程</span>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 添加/编辑卡片对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="cardForm" label-width="100px" ref="cardForm" :rules="rules">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="cardForm.title" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        
        <el-form-item label="课程描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="cardForm.description" 
            placeholder="请输入课程描述"
            :rows="3"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="卡片类型" prop="type">
          <el-select v-model="cardForm.type" placeholder="请选择卡片类型">
            <el-option label="数学" value="math"></el-option>
            <el-option label="计算机" value="computer"></el-option>
            <el-option label="英语" value="english"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签类型" prop="tagType">
          <el-select v-model="cardForm.tagType" placeholder="请选择标签类型">
            <el-option label="默认" value=""></el-option>
            <el-option label="成功" value="success"></el-option>
            <el-option label="信息" value="info"></el-option>
            <el-option label="警告" value="warning"></el-option>
            <el-option label="危险" value="danger"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签" prop="tags">
          <el-tag
            :key="tag"
            v-for="tag in cardForm.tags"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
            :type="cardForm.tagType"
          >
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputTagVisible"
            v-model="inputTagValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputTagConfirm"
            @blur="handleInputTagConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputTag">+ 添加标签</el-button>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCard">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>确定要删除这个课程卡片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      deleteDialogVisible: false,
      dialogTitle: '添加课程',
      inputTagVisible: false,
      inputTagValue: '',
      editingIndex: -1,
      deleteIndex: -1,
      cardForm: {
        title: '',
        description: '',
        type: 'other',
        tagType: '',
        tags: []
      },
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入课程描述', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择卡片类型', trigger: 'change' }
        ]
      },
      subjectCards: [
        {
          title: '高等数学',
          description: '包含微积分、线性代数、概率论与数理统计等核心内容',
          type: 'math',
          tagType: '',
          tags: ['微积分', '线性代数', '概率论']
        },
        {
          title: '计算机科学',
          description: '涵盖数据结构、算法、计算机网络等基础知识',
          type: 'computer',
          tagType: 'info',
          tags: ['数据结构', '算法', '计算机网络']
        },
        {
          title: '英语学习',
          description: '包含听说读写全方位的英语学习资料和练习',
          type: 'english',
          tagType: 'success',
          tags: ['口语', '写作', '词汇']
        }
      ]
    }
  },
  computed: {
    filteredCards() {
      if (!this.searchText) {
        return this.subjectCards;
      }
      const searchLower = this.searchText.toLowerCase();
      return this.subjectCards.filter(card => 
        card.title.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    // 获取卡片在原数组中的索引
    getOriginalIndex(card) {
      return this.subjectCards.findIndex(c => c === card);
    },
    
    // 检查是否匹配标题
    isMatchingTitle(card) {
      if (!this.searchText) {
        return false;
      }
      return card.title.toLowerCase().includes(this.searchText.toLowerCase());
    },
    
    // 清除搜索
    handleSearchClear() {
      this.searchText = '';
    },

    // 显示添加卡片对话框
    showAddCardDialog() {
      this.dialogTitle = '添加课程';
      this.editingIndex = -1;
      this.resetCardForm();
      this.dialogVisible = true;
    },
    
    // 编辑卡片
    editCard(index) {
      this.dialogTitle = '编辑课程';
      this.editingIndex = index;
      const card = this.subjectCards[index];
      this.cardForm = {
        title: card.title,
        description: card.description,
        type: card.type,
        tagType: card.tagType || '',
        tags: [...card.tags]
      };
      this.dialogVisible = true;
    },
    
    // 删除卡片
    deleteCard(index) {
      this.deleteIndex = index;
      this.deleteDialogVisible = true;
    },
    
    // 确认删除
    confirmDelete() {
      if (this.deleteIndex > -1) {
        this.subjectCards.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
        this.deleteDialogVisible = false;
        this.$message.success('删除成功');
      }
    },
    
    // 保存卡片
    saveCard() {
      this.$refs.cardForm.validate((valid) => {
        if (valid) {
          const newCard = {
            title: this.cardForm.title,
            description: this.cardForm.description,
            type: this.cardForm.type,
            tagType: this.cardForm.tagType,
            tags: [...this.cardForm.tags]
          };
          
          if (this.editingIndex > -1) {
            // 编辑现有卡片
            this.subjectCards.splice(this.editingIndex, 1, newCard);
            this.$message.success('更新成功');
          } else {
            // 添加新卡片
            this.subjectCards.push(newCard);
            this.$message.success('添加成功');
          }
          
          this.dialogVisible = false;
          this.resetCardForm();
        }
      });
    },
    
    // 重置表单
    resetCardForm() {
      this.cardForm = {
        title: '',
        description: '',
        type: 'other',
        tagType: '',
        tags: []
      };
      if (this.$refs.cardForm) {
        this.$refs.cardForm.resetFields();
      }
    },
    
    // 显示标签输入框
    showInputTag() {
      this.inputTagVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    
    // 处理标签输入确认
    handleInputTagConfirm() {
      let inputValue = this.inputTagValue;
      if (inputValue && this.cardForm.tags.indexOf(inputValue) === -1) {
        this.cardForm.tags.push(inputValue);
      }
      this.inputTagVisible = false;
      this.inputTagValue = '';
    },
    
    // 删除标签
    handleTagClose(tag) {
      this.cardForm.tags.splice(this.cardForm.tags.indexOf(tag), 1);
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.search-bar {
  margin-bottom: 30px;
  max-width: 600px;
}

.search-stats {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.subject-cards {
  margin-top: 20px;
}

.subject-card {
  height: 200px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.subject-card:hover {
  transform: translateY(-5px);
}

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.3s;
}

.subject-card:hover .card-actions {
  opacity: 1;
}

.subject-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

.match-tag {
  margin-left: 8px;
  vertical-align: middle;
}

.subject-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  position: relative;
  z-index: 2;
}

.subject-tags {
  position: relative;
  z-index: 2;
}

.subject-tags .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.card-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.1;
  z-index: 1;
}

.math-bg {
  background-image: url('../assets/math-bg.png');
  background-size: cover;
  background-position: center;
}

.computer-bg {
  background-image: url('../assets/computer-bg.png');
  background-size: cover;
  background-position: center;
}

.english-bg {
  background-image: url('../assets/english-bg.png');
  background-size: cover;
  background-position: center;
}

.other-bg {
  background-color: #f0f0f0;
}

.add-card {
  height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.add-card:hover {
  border-color: #409EFF;
  color: #409EFF;
  transform: translateY(-5px);
}

.add-card i {
  font-size: 30px;
  margin-bottom: 10px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>