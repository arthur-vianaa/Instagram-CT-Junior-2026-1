import { PostWithAuthor } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostDetailsPresenter {
  static toHTTP(post: PostWithAuthor) {
    return {
      username: post.authorName,          
      post_photo: post.fotoLink,        
      description: post.description,     
      user_photo: post.authorProfilePicture ?? null, 
      post_id: post.postId.toString(),  
    }
  }
}
