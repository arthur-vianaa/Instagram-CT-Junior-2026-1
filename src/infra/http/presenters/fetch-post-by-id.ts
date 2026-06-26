import { PostWithAuthor } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FetchPostDetailsByIdPresenter {
  static toHTTP(data: { authorName: string; authorProfilePicture: string | null; posts: PostWithAuthor[] }) {
    return {
      user_photo: data.authorProfilePicture ?? null,
      username: data.authorName,
      posts: data.posts.map(post => ({
        foto: post.fotoLink,
        description: post.description,
        post_id: post.postId.toString(),
      }))
    }
  }
}