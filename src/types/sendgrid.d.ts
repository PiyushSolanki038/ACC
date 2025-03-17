declare module '@sendgrid/mail' {
  export interface MailDataRequired {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
  }

  interface SendGridMail {
    setApiKey(apiKey: string): void;
    send(data: MailDataRequired): Promise<[any, {}]>;
  }

  const mail: SendGridMail;
  export default mail;
} 