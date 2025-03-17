<template>
  <div>
    <!-- 富文本编辑器 -->
    <div id="wangeditor">
    </div>
  </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script>

// import { uploadImage } from '@/api/api'; // 导入图片上传api
import E from 'wangeditor';


export default {
  name: 'richText',
  components: {
  },
  props: {
    defaultDetails: {
      default: '请填写内容',
      type: String,
    },
  },
  watch: {
    htmlContent(val) {
      this.$emit('change', val); // 将改变同步到父组件
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
    }
  },
  data() {
    return {
      editor: null,
      htmlContent: '<p>hello</p>',
      firtherMethod: 'loadingCompleted', // 回调父组件，通知editor已经创建完成
    };
  },
  methods: {
    // 获取text文本
    getText() {
      const text = this.editor.txt.text();
      console.log('text = ', text);
      return text;
    },
    // 获取html
    getHtml() {
      const html = this.editor.txt.html();
      console.log('thml = ', html);
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
      this.editor.txt.html(html);// 重新设置编辑器内容
    },
    // 追加内容
    appentHtml(html) {
      this.editor.txt.append(html);// 继续追加内容。
    },
    // 销毁编辑器
    beforeDestroy() {
      // 销毁编辑器
      console.log('销毁前');
      this.editor.destroy()
      console.log('销毁后');
      this.editor = null
    },
    // 清空编辑器内容
    clearText() {
      this.editor.txt.clear();
    },

    createEditor() {
      if(this.editor !== null) {
        return;
      }

      this.editor = new E('#wangeditor');
      // 或者 const editor = new E( document.getElementById('div1') )
      this.editor.config.height = 200; // 设置高度

      // 内容发生改变时回调
      // this.editor.config.onchange = function (html) {
        // this.htmlContent = html;
      // }

      this.editor.config.placeholder = this.defaultDetails; // 自定义初始文字提示

      this.editor.config.focus = false;// 取消初始化时自动聚焦

      this.editor.config.menus = [ // 定义显示哪些菜单和菜单的顺序。
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        // 'strikeThrough', // 删除线
        // 'indent',
        'lineHeight',
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        // 'todo',
        // 'justify', // 对齐方式
        // 'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        // 'table', // 表格
        // 'video', // 插入视频
        // 'code', // 插入代码
        'splitLine',
        'undo', // 撤销
        'redo', // 重复
      ];

      // this.editor.config.uploadImgServer = '/upload-img'; // 配置上传server 接口地址
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 图片上传max
      this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']; // 图片上传类型
      this.editor.config.uploadImgMaxLength = 1; // 一次最多上传 1 个图片

      this.editor.config.customUploadImg = async function (resultFiles, insertImgFn) { // 自定义图片上传实现
      // resultFiles 是 input 中选中的文件列表；insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const file = resultFiles[0];
        // const path = await uploadImage(file);//返回图片地址
        console.log('完整path = ', path);
      // 上传图片，返回结果，将图片插入到编辑器中
        // insertImgFn(path);
      }

      // 使用base64格式保存本地图片，不可与uploadImgServer同时使用
      // this.editor.config.uploadImgShowBase64 = true;

      this.editor.create();

      // this.editor.txt.html('<p>用 JS 设置的内容</p>');// 重新设置编辑器内容
      // 第一步，初始化 textarea 的值
      // text1.val(this.editor.txt.html())
      console.log('this.editor = ', this.editor);
      // this.editor.txt.append('<p>追加的内容</p>');// 继续追加内容。

      // 创建完成，回调父组件
      try {
        this.$emit(this.firtherMethod, null);
      } catch (error) {
        console.log('editor 完成，回调父组件失败 error = ', error);
      }
    },
  },
  mounted() {
    this.createEditor();
  },
};
</script>

<style lang="css"  src="">
/* @import '../css/Cnel.css';

/* 使用style属性src引入外部css，仅在当前s组件有效 */
</style>


