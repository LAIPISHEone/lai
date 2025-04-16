export function handleCopy(value) {
    // 创建一个临时的textarea元素来复制文本
    const textarea = document.createElement('textarea')
    textarea.value = value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    this.$message.success('已复制到剪贴板')
}