<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="课程笔记" name="notes">
        <!-- 课程笔记内容区域 -->
        <div style="display: flex">
          <div
            style="
              width: 300px;
              height: 309px;
              background-color: #fff;
              margin-top: 20px;
              margin-right: 20px;
              border: #c0c0c0 1px solid;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                border-bottom: #c0c0c0 1px solid;
              "
            >
              <span style="margin: 10px 0 10px 10px">目录</span>
            </div>

            <ul>
              <li
                v-for="(item, index) in list"
                style="list-style-type: none; padding: 5px"
                :style="{ 'padding-left': item.padding }"
                :key="index"
              >
                <a
                  :class="activeIndex === index ? 'active' : 'activeFalse'"
                  @click="handleItemClick(index)"
                  style="text-decoration: none"
                  >{{ item.title }}</a
                >
              </li>
            </ul>
          </div>
          <!-- 富文本编辑器 -->
          <div style="margin-top: 20px; width: 60%" id="wangeditor"></div>
          <!-- 添加保存和编辑按钮 -->
        </div>
        <div style="margin-top: 20px ;display: flex;justify-content: center;t">
          <!-- <el-button type="primary" @click="editNotes">编辑</el-button> -->
          <el-button type="success" @click="saveNotes">保存</el-button>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="课程资料" name="materials">
        <div>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div v-if="fileList.length > 0">
            <h3>文件列表</h3>
            <ul>
              <li v-for="(file, index) in fileList" :key="index">
                {{ file.name }}
                <el-button type="text" @click="downloadFile(file)">下载</el-button>
                <el-button type="text" @click="previewFile(file)">预览</el-button>
              </li>
            </ul>
          </div>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import E from "wangeditor";
import { getCoursesNote } from "@/api/courses/index.js";

export default {
  data() {
    return {
      activeTab: "notes", // 默认激活的标签页
      editor: null,
      htmlContent: "<p>hello</p>",
      firtherMethod: "loadingCompleted", // 回调父组件，通知editor已经创建完成
      list: [],
      activeIndex: 0,
      fileList: [], // 文件列表
      isEditing: false, // 是否处于编辑状态
    };
  },
  created() {},

  methods: {
    // 获取text文本
    getText() {
      const text = this.editor.txt.text();
      console.log("text = ", text);
      return text;
    },
    // 获取html
    getHtml() {
      const html = this.editor.txt.html();
      console.log("thml = ", html);
      return html;
    },
    // 设置内容
    setHtml(html) {
      this.editor.txt.html(html); // 重新设置编辑器内容
    },
    // 追加内容
    appentHtml(html) {
      this.editor.txt.append(html); // 继续追加内容。
    },
    // 销毁编辑器
    beforeDestroy() {
      // 销毁编辑器
      console.log("销毁前");
      this.editor.destroy();
      console.log("销毁后");
      this.editor = null;
    },
    // 清空编辑器内容
    clearText() {
      this.editor.txt.clear();
    },

    createEditor() {
      if (this.editor !== null) {
        return;
      }

      this.editor = new E("#wangeditor");
      // 或者 const editor = new E( document.getElementById('div1') )
      this.editor.config.height = 600; // 设置高度

      // 内容发生改变时回调
      this.editor.config.onchange = (html) => {
        console.log("内容改变", html);

        // this.htmlContent = html;
      };

      this.editor.config.placeholder = this.defaultDetails; // 自定义初始文字提示

      this.editor.config.focus = false; // 取消初始化时自动聚焦

      this.editor.config.menus = [
        // 定义显示哪些菜单和菜单的顺序。
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        // 'strikeThrough', // 删除线
        // 'indent',
        "lineHeight",
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        // 'todo',
        // 'justify', // 对齐方式
        // 'quote', // 引用
        // 'emoticon', // 表情
        "image", // 插入图片
        // 'table', // 表格
        // "video", // 插入视频
        // "code", // 插入代码
        "splitLine",
        "undo", // 撤销
        "redo", // 重复
      ];

      // this.editor.config.uploadImgServer = '/upload-img'; // 配置上传server 接口地址
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 图片上传max
      this.editor.config.uploadImgAccept = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
      ]; // 图片上传类型
      this.editor.config.uploadImgMaxLength = 1; // 一次最多上传 1 个图片

      this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // 自定义图片上传实现
        // resultFiles 是 input 中选中的文件列表；insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const file = resultFiles[0];
        // const path = await uploadImage(file);//返回图片地址
        console.log("完整path = ", path);
        // 上传图片，返回结果，将图片插入到编辑器中
        // insertImgFn(path);
      };

      // 使用base64格式保存本地图片，不可与uploadImgServer同时使用
      // this.editor.config.uploadImgShowBase64 = true;

      this.editor.create();

      // this.editor.txt.html('<p>用 JS 设置的内容</p>');// 重新设置编辑器内容
      // 第一步，初始化 textarea 的值
      // text1.val(this.editor.txt.html())
      console.log("this.editor = ", this.editor);
      // this.editor.txt.append('<p>追加的内容</p>');// 继续追加内容。

      // 创建完成，回调父组件
      try {
        this.$emit(this.firtherMethod, null);
      } catch (error) {
        console.log("editor 完成，回调父组件失败 error = ", error);
      }
    },
    handleItemClick(index) {
      this.activeIndex = index;
      console.log("index = ", index);
      // 获取目标锚点元素
      const targetElement = document.getElementById(this.list[index].id);
      if (targetElement) {
        // 滚动到目标锚点
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    // 文件上传相关方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    downloadFile(file) {
      // 下载文件逻辑
      console.log("下载文件:", file);
      // 这里可以添加实际的下载逻辑，例如使用a标签下载
      const link = document.createElement("a");
      link.href = file.url; // 文件的URL
      link.download = file.name; // 文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    previewFile(file) {
      // 预览文件逻辑
      console.log("预览文件:", file);
      // 这里可以添加实际的预览逻辑，例如使用iframe预览
      const previewWindow = window.open();
      previewWindow.document.write(
        `<iframe src="${file.url}" width="100%" height="100%" style="border:none;"></iframe>`
      );
    },
    // 添加编辑笔记的方法
    editNotes() {
      this.isEditing = true;
    },
    // 添加保存笔记的方法
    saveNotes() {
      if (!this.isEditing) {
        this.$message.warning("请先编辑笔记内容");
        return;
      }
      const htmlContent = this.getHtml();
      // 这里可以添加保存笔记到后端的逻辑
      console.log("保存笔记内容:", htmlContent);
      // 示例：发送笔记内容到后端
      // this.$axios.post('/api/saveNotes', { content: htmlContent })
      //   .then(response => {
      //     this.$message.success('笔记保存成功');
      //   })
      //   .catch(error => {
      //     this.$message.error('笔记保存失败');
      //   });
      this.isEditing = false;
    },
  },

  mounted() {
    this.createEditor();
    this.setHtml("<p>可以在该区域编辑你的笔记</p>");
    // let heml =
    //   "<h1>高等数学</h1><h2>微积分基础</h2><p>微积分是高等数学的核心内容之一，主要包括微分和积分两部分。微分用于研究函数的变化率，而积分则用于计算面积、体积等。</p><h3>微分的基本概念</h3><p>微分是研究函数在某一点的变化率的工具。通过求导，我们可以得到函数的导数，进而分析函数的单调性、极值等性质。</p><h3>积分的应用</h3><p>积分在物理学、工程学等领域有广泛的应用。例如，通过积分可以计算物体的质量、重心等。</p><h2>线性代数</h2><p>线性代数是研究向量、矩阵、线性方程组等内容的数学分支。它在计算机科学、物理学等领域有重要应用。</p><h3>矩阵与行列式</h3><p>矩阵是线性代数中的重要工具，行列式则用于判断矩阵是否可逆。通过矩阵运算，可以求解线性方程组。</p><h3>向量空间</h3><p>向量空间是线性代数的核心概念之一，它描述了向量的线性组合和线性无关性。向量空间在机器学习、图像处理等领域有广泛应用。</p>";

    // let heml = `<h1 id="section-1">高等数学</h1><h2 id="section-2">微积分基础</h2><p>微积分是高等数学的核心内容之一，主要包括微分和积分两部分。微分用于研究函数的变化率，而积分则用于计算面积、体积等。</p><ol><li><p><strong>导数定义</strong>：函数<math><semantics><mrow><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></semantics></math>f(x)在点<math><semantics><mrow><msub><mi>x</mi><mn>0</mn></msub></mrow></semantics></math>x0处的导数为极限&nbsp;<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><msub><mrow><mi>lim</mi><mo>⁡</mo></mrow><mrow><mi>Δ</mi><mi>x</mi><mo>→</mo><mn>0</mn></mrow></msub><mfrac><mrow><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>+</mo><mi>Δ</mi><mi>x</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo></mrow><mrow><mi>Δ</mi><mi>x</mi></mrow></mfrac></mrow></semantics></math>f′(x0)=limΔx→0Δxf(x0+Δx)−f(x0)。</p></li><li><p><strong>几何意义</strong>：导数表示函数图像在该点的切线斜率。</p></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>单调性</strong>：若<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>&gt;</mo><mn>0</mn></mrow></semantics></math>f′(x)&gt;0（或<math><semantics><mrow><mo>&lt;</mo><mn>0</mn></mrow></semantics></math>&lt;0），则函数单调递增（或递减）。</p></li><li><p><strong>极值</strong>：通过导数为零的点（驻点）及二阶导数判断极大值、极小值。</p></li><li><p><strong>泰勒展开</strong>：用多项式逼近函数，分析局部性质。</p></li></ul></li></ol><h3 id="section-3">微分的基本概念</h3><p>微分是研究函数在某一点的变化率的工具。通过求导，我们可以得到函数的导数，进而分析函数的单调性、极值等性质。</p><h3 id="section-4">积分的应用</h3><p>积分在物理学、工程学等领域有广泛的应用。例如，通过积分可以计算物体的质量、重心等。</p><h2 id="section-5">线性代数</h2><p>线性代数是研究向量、矩阵、线性方程组等内容的数学分支。它在计算机科学、物理学等领域有重要应用。</p><h3 id="section-6">矩阵与行列式</h3><p>矩阵是线性代数中的重要工具，行列式则用于判断矩阵是否可逆。通过矩阵运算，可以求解线性方程组。</p><h3 id="section-7">向量空间</h3><p>向量空间是线性代数的核心概念之一，它描述了向量的线性组合和线性无关性。向量空间在机器学习、图像处理等领域有广泛应用。</p>`;

    //     let heml = `<h1 id="section-1">高等数学</h1><h2 id="section-2">微积分基础</h2><p>微积分是高等数学的核心内容之一，由微分学和积分学两部分组成。微分学研究函数的瞬时变化率（导数）和局部性质，而积分学研究函数的累积效应（积分）和全局性质。两者通过微积分基本定理紧密联系，构成现代数学和科学的基础工具。</p><h3 id="section-3">微分的基本概念</h3><p>微分是研究函数在某一点的变化率的工具。通过求导，我们可以得到函数的导数，进而分析函数的单调性、极值等性质。</p><ol><li><p><strong>导数定义</strong>：函数<math><semantics><mrow><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></semantics></math>f(x)在点<math><semantics><mrow><msub><mi>x</mi><mn>0</mn></msub></mrow></semantics></math>x0处的导数为极限&nbsp;<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><msub><mrow><mi>lim</mi><mo>⁡</mo></mrow><mrow><mi>Δ</mi><mi>x</mi><mo>→</mo><mn>0</mn></mrow></msub><mfrac><mrow><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>+</mo><mi>Δ</mi><mi>x</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo></mrow><mrow><mi>Δ</mi><mi>x</mi></mrow></mfrac></mrow></semantics></math>f′(x0)=limΔx→0Δxf(x0+Δx)−f(x0)。</p></li><li><p><strong>几何意义</strong>：导数表示函数图像在该点的切线斜率。</p></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>单调性</strong>：若<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>&gt;</mo><mn>0</mn></mrow></semantics></math>f′(x)&gt;0（或<math><semantics><mrow><mo>&lt;</mo><mn>0</mn></mrow></semantics></math>&lt;0），则函数单调递增（或递减）。</p></li><li><p><strong>极值</strong>：通过导数为零的点（驻点）及二阶导数判断极大值、极小值。</p></li><li><p><strong>泰勒展开</strong>：用多项式逼近函数，分析局部性质。</p></li></ul></li></ol><h3 id="section-4">积分的应用</h3><p>积分分为不定积分（原函数）和定积分（面积、累积量），主要应用包括：</p><ol><li><p><strong>几何应用</strong>：计算曲线围成的面积、旋转体体积、弧长等。</p></li><li><p><strong>物理应用</strong>：</p><ul><li><p><strong>质量分布</strong>：通过密度函数积分求质量。</p></li><li><p><strong>重心计算</strong>：利用积分求不均匀物体的质心。</p></li><li><p><strong>功与能量</strong>：变力做功问题通过路径积分求解。</p></li></ul></li><li><p><strong>工程应用</strong>：信号处理中的傅里叶变换、概率论中的概率密度积分等。</p></li></ol><h2 id="section-5">线性代数</h2><p>线性代数是研究向量、矩阵、线性方程组等内容的数学分支。它在计算机科学、物理学等领域有重要应用。</p><h3 id="section-6">矩阵与行列式</h3><ol><li><p><strong>矩阵</strong>：</p><ul><li><p><strong>定义</strong>：由<math><semantics><mrow><mi>m</mi><mo>×</mo><mi>n</mi></mrow></semantics></math>m×n个数排列成的矩形阵列，表示线性变换或数据。</p></li><li><p><strong>运算</strong>：加法、数乘、乘法（需满足维度匹配）、转置。</p></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>线性方程组</strong>：<math><semantics><mrow><mi>A</mi><mi>x</mi><mo>=</mo><mi>b</mi></mrow></semantics></math>Ax=b的求解（如高斯消元法）。</p></li><li><p><strong>计算机图形学</strong>：矩阵表示旋转、缩放等变换。</p></li></ul></li></ul></li><li><p><strong>行列式</strong>：</p><ul><li><p><strong>定义</strong>：方阵<math><semantics><mrow><mi>A</mi></mrow></semantics></math>A的行列式<math><semantics><mrow><mi>det</mi><mo>⁡</mo><mo>(</mo><mi>A</mi><mo>)</mo></mrow></semantics></math>det(A)是一个标量，反映线性变换的缩放因子。</p></li><li><p><strong>性质</strong>：</p><ul><li><p><math><semantics><mrow><mi>det</mi><mo>⁡</mo><mo>(</mo><mi>A</mi><mo>)</mo><mo>≠</mo><mn>0</mn></mrow></semantics></math>det(A)=0等价于矩阵可逆。</p></li><li><p>行列式为0时，矩阵为奇异矩阵（线性相关）。</p></li></ul></li><li><p><strong>计算</strong>：拉普拉斯展开、上三角化简化。</p></li></ul></li></ol><h3 id="section-7">向量空间</h3><ol><li><p><strong>核心概念</strong>：</p><ul><li><p><strong>向量空间</strong>：满足加法和数乘封闭性的集合（如<math><semantics><mrow><msup><mi>R</mi><mi>n</mi></msup></mrow></semantics></math>Rn）。</p></li><li><p><strong>基与维数</strong>：极大线性无关组称为基，基的个数为维数。</p></li><li><p><strong>线性变换</strong>：向量空间之间的映射<math><semantics><mrow><mi>T</mi></mrow></semantics></math>T满足<math><semantics><mrow><mi>T</mi><mo>(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>)</mo><mo>=</mo><mi>a</mi><mi>T</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>+</mo><mi>b</mi><mi>T</mi><mo>(</mo><mi>y</mi><mo>)</mo></mrow></semantics></math>T(ax+by)=aT(x)+bT(y)。</p></li></ul></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>机器学习</strong>：</p><ul><li><p>特征向量用于主成分分析（PCA）。</p></li><li><p>数据表示为向量，便于降维和分类。</p></li></ul></li><li><p><strong>图像处理</strong>：</p><ul><li><p>像素矩阵的奇异值分解（SVD）用于压缩。</p></li><li><p>卷积运算（滤波）通过矩阵乘法实现。</p></li></ul></li></ul></li></ol><p><br/></p>
    //

    // `;
    getCoursesNote({ courseId: this.$route.query.id, userId: 4 }).then(
      (res) => {
        if (res.data.code == 200) {
          this.setHtml(res.data.data.course_html);
        }
      }
    );

    // let heml =
    //   '<h1 id="section-1">高等数学</h1><h2 id="section-2">微积分基础</h2><p>微积分是高等数学的核心内容之一，由微分学和积分学两部分组成。微分学研究函数的瞬时变化率（导数）和局部性质，而积分学研究函数的累积效应（积分）和全局性质。两者通过微积分基本定理紧密联系，构成现代数学和科学的基础工具。</p><h3 id="section-3">微分的基本概念</h3><p>微分是研究函数在某一点的变化率的工具。通过求导，我们可以得到函数的导数，进而分析函数的单调性、极值等性质。</p><ol><li><p><strong>导数定义</strong>：函数<math><semantics><mrow><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></semantics></math>f(x)在点<math><semantics><mrow><msub><mi>x</mi><mn>0</mn></msub></mrow></semantics></math>x0处的导数为极限&nbsp;<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><msub><mrow><mi>lim</mi><mo>⁡</mo></mrow><mrow><mi>Δ</mi><mi>x</mi><mo>→</mo><mn>0</mn></mrow></msub><mfrac><mrow><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>+</mo><mi>Δ</mi><mi>x</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo></mrow><mrow><mi>Δ</mi><mi>x</mi></mrow></mfrac></mrow></semantics></math>f′(x0)=limΔx→0Δxf(x0+Δx)−f(x0)。</p></li><li><p><strong>几何意义</strong>：导数表示函数图像在该点的切线斜率。</p></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>单调性</strong>：若<math><semantics><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>&gt;</mo><mn>0</mn></mrow></semantics></math>f′(x)&gt;0（或<math><semantics><mrow><mo>&lt;</mo><mn>0</mn></mrow></semantics></math>&lt;0），则函数单调递增（或递减）。</p></li><li><p><strong>极值</strong>：通过导数为零的点（驻点）及二阶导数判断极大值、极小值。</p></li><li><p><strong>泰勒展开</strong>：用多项式逼近函数，分析局部性质。</p></li></ul></li></ol><h3 id="section-4">积分的应用</h3><p>积分分为不定积分（原函数）和定积分（面积、累积量），主要应用包括：</p><ol><li><p><strong>几何应用</strong>：计算曲线围成的面积、旋转体体积、弧长等。</p></li><li><p><strong>物理应用</strong>：</p><ul><li><p><strong>质量分布</strong>：通过密度函数积分求质量。</p></li><li><p><strong>重心计算</strong>：利用积分求不均匀物体的质心。</p></li><li><p><strong>功与能量</strong>：变力做功问题通过路径积分求解。</p></li></ul></li><li><p><strong>工程应用</strong>：信号处理中的傅里叶变换、概率论中的概率密度积分等。</p></li></ol><h2 id="section-5">线性代数</h2><p>线性代数是研究向量、矩阵、线性方程组等内容的数学分支。它在计算机科学、物理学等领域有重要应用。</p><h3 id="section-6">矩阵与行列式</h3><ol><li><p><strong>矩阵</strong>：</p><ul><li><p><strong>定义</strong>：由<math><semantics><mrow><mi>m</mi><mo>×</mo><mi>n</mi></mrow></semantics></math>m×n个数排列成的矩形阵列，表示线性变换或数据。</p></li><li><p><strong>运算</strong>：加法、数乘、乘法（需满足维度匹配）、转置。</p></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>线性方程组</strong>：<math><semantics><mrow><mi>A</mi><mi>x</mi><mo>=</mo><mi>b</mi></mrow></semantics></math>Ax=b的求解（如高斯消元法）。</p></li><li><p><strong>计算机图形学</strong>：矩阵表示旋转、缩放等变换。</p></li></ul></li></ul></li><li><p><strong>行列式</strong>：</p><ul><li><p><strong>定义</strong>：方阵<math><semantics><mrow><mi>A</mi></mrow></semantics></math>A的行列式<math><semantics><mrow><mi>det</mi><mo>⁡</mo><mo>(</mo><mi>A</mi><mo>)</mo></mrow></semantics></math>det(A)是一个标量，反映线性变换的缩放因子。</p></li><li><p><strong>性质</strong>：</p><ul><li><p><math><semantics><mrow><mi>det</mi><mo>⁡</mo><mo>(</mo><mi>A</mi><mo>)</mo><mo>≠</mo><mn>0</mn></mrow></semantics></math>det(A)=0等价于矩阵可逆。</p></li><li><p>行列式为0时，矩阵为奇异矩阵（线性相关）。</p></li></ul></li><li><p><strong>计算</strong>：拉普拉斯展开、上三角化简化。</p></li></ul></li></ol><h3 id="section-7">向量空间</h3><ol><li><p><strong>核心概念</strong>：</p><ul><li><p><strong>向量空间</strong>：满足加法和数乘封闭性的集合（如<math><semantics><mrow><msup><mi>R</mi><mi>n</mi></msup></mrow></semantics></math>Rn）。</p></li><li><p><strong>基与维数</strong>：极大线性无关组称为基，基的个数为维数。</p></li><li><p><strong>线性变换</strong>：向量空间之间的映射<math><semantics><mrow><mi>T</mi></mrow></semantics></math>T满足<math><semantics><mrow><mi>T</mi><mo>(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>)</mo><mo>=</mo><mi>a</mi><mi>T</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>+</mo><mi>b</mi><mi>T</mi><mo>(</mo><mi>y</mi><mo>)</mo></mrow></semantics></math>T(ax+by)=aT(x)+bT(y)。</p></li></ul></li><li><p><strong>应用</strong>：</p><ul><li><p><strong>机器学习</strong>：</p><ul><li><p>特征向量用于主成分分析（PCA）。</p></li><li><p>数据表示为向量，便于降维和分类。</p></li></ul></li><li><p><strong>图像处理</strong>：</p><ul><li><p>像素矩阵的奇异值分解（SVD）用于压缩。</p></li><li><p>卷积运算（滤波）通过矩阵乘法实现。</p></li></ul></li></ul></li></ol><p><br/></p>\n﻿\n\n';

    // this.setHtml(heml);

    // const data = {
    //   courseId: 2,
    //   userId: 4,
    //   courseHtml: heml,
    // };

    // const jsonString = JSON.stringify(data);
    // console.log(jsonString);

    // 使用正则表达式匹配 h1 到 h5 标签及其内容
    // const regex = /<h([1-5])>(.*?)<\/h\1>/g;
    const regex = /<h([1-5]) id="[^"]*">(.*?)<\/h\1>/g;
    let match;
    let tempList = [];
    let idCounter = 1; // 用于生成唯一的id

    while ((match = regex.exec(heml)) !== null) {
      const id = `section-${idCounter}`;
      tempList.push({
        title: match[2],
        padding: `${parseInt(match[1]) * 10}px`, // 根据标签级别设置不同的padding
        id: id, // 生成唯一的id
      });
      idCounter++;
    }

    this.list = tempList;

    // 为每个标题设置唯一的id
    this.$nextTick(() => {
      const headings = document.querySelectorAll(
        "#wangeditor h1, #wangeditor h2, #wangeditor h3, #wangeditor h4, #wangeditor h5"
      );
      headings.forEach((heading, index) => {
        heading.setAttribute("id", tempList[index].id);
      });
    });
  },
};
</script>

<style scoped>
/* @import '../css/Cnel.css'; */

/* 使用style属性src引入外部css，仅在当前s组件有效 */
.active {
  font-weight: bold;
  color: #4c70c5;
}
.activeFalse {
  /* font-weight: bold; */
  color: black;
}
li:hover {
  color: #4c70c5;
  cursor: pointer;
}
</style>