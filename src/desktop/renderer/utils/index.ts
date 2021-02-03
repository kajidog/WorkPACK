import marked from "marked";
export const AddBrank = (html: string) => {

  let count = 0
  let work = html
  let next = ""
  while (count++ < 30) {
    const start = work.indexOf("<a ");
    if (start === -1) {
      break;
    }
    next += work.substr(0, start + 3) + "target='_blank' "
    work = work.substr(start + 3)
  }
  next += work
  return next
}
export const getHTML = (word: string) => AddBrank(marked(word))


export const stopPropagation = (
  e: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  e.stopPropagation();
};


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