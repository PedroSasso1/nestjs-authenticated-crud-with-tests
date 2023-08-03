export class Util {
  static dateAddMinutes(date: Date, minutes = 1) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }
}
