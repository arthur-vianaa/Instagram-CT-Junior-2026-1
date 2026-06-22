import { PostWithAuthor } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailDetailsPresenterForReceiver {

  static toHTTP(email: PostWithAuthor) {

    return {
      description: email.description,
      fotoLink: email.fotoLink,
      authorName: email.authorName,
      authorProfilePicture: email.authorProfilePicture,
      data: email.data,
    }
  }
}