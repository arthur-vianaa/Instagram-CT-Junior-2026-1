import { Email } from "@/domain/enterprise/entities/post";
import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FetchEmailDetailsPresenterForReceiver {

  static toHTTP(email: EmailWithSenderReceiverNames) {

    return {
      title: email.title,
      content: email.content,
      enviado_por: email.senderEmail,
    }
  }
}