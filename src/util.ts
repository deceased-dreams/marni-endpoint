import * as moment from "moment";

export function age(date: Date) {
  return moment().diff(date, "years");
}

export function htmlDate(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}