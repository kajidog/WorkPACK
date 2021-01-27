import { Work } from "../../../store/classroom";

export const getTime = (work: Work) => {
    if (!work.dueDate) {
      return "なし";
    }
    return (
      work.dueDate.month +
      "/" +
      work.dueDate.day +
      " " +
      (work.dueTime.hours || "00") +
      ":" +
      (work.dueTime.minutes || "00")
    );
  };