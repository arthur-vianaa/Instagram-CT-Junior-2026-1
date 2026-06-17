import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FetchEmailDetailsPresenterForSender {

  static toHTTP(email: EmailWithSenderReceiverNames) {

    return {
      title: email.title,
      content: email.content,
      enviado_para: email.receiverEmail,
    }
  }
}