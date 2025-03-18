<template>
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
  </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script>
// import { uploadImage } from '@/api/api'; // 导入图片上传api
import E from "wangeditor";

export default {
  name: "richText",
  components: {},
  props: {
    defaultDetails: {
      default: "请填写内容",
      type: String,
    },
  },
  watch: {
    htmlContent(val) {
      this.$emit("change", val); // 将改变同步到父组件
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [val]);
      }
    },
  },
  data() {
    return {
      editor: null,
      htmlContent: "<p>hello</p>",
      firtherMethod: "loadingCompleted", // 回调父组件，通知editor已经创建完成
      list: [],
      activeIndex: 0,
    };
  },
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
    // 图片上传自定义实现
    // async uploadImage(files) {
    //   const file = files[0];
    //   console.log('Fuedit2-uploadImage file = ', file);
    //   const res = await uploadImage(obj);
    //   const path = SOCKET + (res.path || {});
    //   console.log('完整path = ', path);
    //   return path;
    // },
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
      this.editor.config.onchange = function (html) {
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

      this.editor.config.customUploadImg = async function (
        resultFiles,
        insertImgFn
      ) {
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
  },

  mounted() {
    this.createEditor();
    this.setHtml("<p>初始化从后端获取内容</p>");
    let heml =
      "<h1>标题</h1><h2>标题A</h2><p>正文</p><p>正文</p><p>正文</p><h3>标题A1</h3><p>正文</p><p>正文</p><p>正文</p><h3>标题A2</h3><p>正文</p><p>正文</p><p>正文</p><h2>标题B</h2><h3>标题B1</h3><p>正文</p><p>正文</p><p>正文</p><h3>标题B2</h3><p>正文</p><p>正文</p><p>正文</p>";
    this.setHtml(heml);

    // 使用正则表达式匹配 h1 到 h5 标签及其内容
    const regex = /<h([1-5])>(.*?)<\/h\1>/g;
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

<style lang="css" scoped>
/* @import '../css/Cnel.css';

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
