export class Util {
  static dateAddMinutes(date: Date, minutes = 1) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  static parseDateString(date: string) {
    return new Date(Date.parse(date));
  }

  static formatNumberToCurrency(
    num: number,
    locale = 'pt-BR',
    currency = 'BRL',
  ) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(num);
  }
}
