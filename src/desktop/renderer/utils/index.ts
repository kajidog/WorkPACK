import marked from "marked";

// マークダウンのリンクを新規タブで開くように強制する
export const AddBlank = (html: string) => {
  let count = 0;  // 無限ループ回避
  let work = html;
  let next = "";

  while (count++ < 30) {
    const start = work.indexOf("<a ");
    if (start === -1) {
      break;
    }
    next += work.substr(0, start + 3) + "target='_blank' "
    work = work.substr(start + 3)
  }
  next += work;
  return next;
}

// マークダウンをHTMLに変換（リンクは新規タブで）
export const getHTML = (word: string) => AddBlank(marked(word))

// クリックを親要素に伝達しない
export const stopPropagation = (
  e: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  e.stopPropagation();
};

// ブロブに変換
export const toBlob = async (file: any, cb: (res: any) => void) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result)
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
};