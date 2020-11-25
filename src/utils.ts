export const buildDateTimeString = function (date: Date): string {
  const today = new Date(date);

  // we have to add a 0 in our string for the day if day is less than 10
  let day: number | string = today.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  return `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
};
