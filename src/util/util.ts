import { Despesa } from 'src/despesas/entities/despesa.entity';

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

  static getDespesaMailBody(despesa: Despesa) {
    const body = `<html>
    <body>
      <h1>Despesa cadastrada!</h1>

      <p><span style="font-weight: bold">ID:</span> ${despesa.id}</p>
      
      <p><span style="font-weight: bold">Descrição</span>: ${
        despesa.description
      }</p>
      
      <p><span style="font-weight: bold">Data de criação:</span> ${
        despesa.createdAt
      }</p>

      <p><span style="font-weight: bold">Criador pelo ID:</span> ${
        despesa.createdBy
      }</p>

      <p><span style="font-weight: bold">Valor (R$):</span> ${Util.formatNumberToCurrency(
        despesa.value,
      )}</p>
    </body>
  </html>`;

    return body;
  }
}
