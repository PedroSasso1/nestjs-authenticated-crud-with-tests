import { Injectable } from '@nestjs/common';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.AWS_REGION });

export type EmailProps = {
  toAddresses: string[];
  subject: string;
  body: string;
};

@Injectable()
export class MailerService {
  private readonly ses: SESClient = sesClient;

  async sendEmail(props: EmailProps) {
    const params: SendEmailCommandInput = {
      Source: process.env.SES_SOURCE,
      Destination: {
        ToAddresses: props.toAddresses,
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: props.subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: props.body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: '',
          },
        },
      },
    };

    const response = await this.ses.send(new SendEmailCommand(params));

    return response.$metadata.httpStatusCode === 200;
  }
}
