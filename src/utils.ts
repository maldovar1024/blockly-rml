/**
 * 下载指定的文件
 * @param content 文件内容
 * @param filename 文件名
 */
export function downloadFile(content: string, filename: string) {
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}

export function uploadFile(accept = ''): Promise<File | undefined> {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  input.accept = accept;
  const files = new Promise<File | undefined>(resolve => {
    input.onchange = () => {
      resolve(input.files?.[0]);
    };
  });
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
  return files;
}
