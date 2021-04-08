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

/**
 * 上传文件
 * @param accept 与 `input` 元素的 `accept` 属性含义相同
 * @returns 返回用户选择的文件
 */
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

/**
 * 读取文本文件的内容
 * @param file 要读取的文件
 * @returns 返回读取到的字符串
 */
export async function readTextFile(file: File): Promise<string | undefined> {
  const reader = new FileReader();
  const readerPromise = new Promise<string | undefined>(resolve => {
    reader.onload = () => {
      const content = reader.result;
      resolve(typeof content === 'string' ? content : undefined);
    };
  });
  reader.readAsText(file);
  return readerPromise;
}

/**
 * 上传并读取文本文件的内容
 * @param accept 与 `input` 元素的 `accept` 属性含义相同
 * @returns 返回读取到的字符串
 */
export async function uploadAndReadTextFile(
  accept = ''
): Promise<string | undefined> {
  const file = await uploadFile(accept);
  if (file === undefined) {
    return undefined;
  }

  return readTextFile(file);
}
