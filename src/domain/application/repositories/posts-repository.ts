import { Post } from '@/domain/enterprise/entities/post'
import { PostWithAuthor } from '@/domain/enterprise/entities/value-objects/post-with-author-props';

export abstract class PostsRepository {
  abstract findById(id: string): Promise<Post | null>
  abstract findDetailsById(id: string): Promise<PostWithAuthor | null>
  abstract save(post: Post): Promise<void>
  abstract findManyByAuthorId(authorId: string): Promise<PostWithAuthor[]> 
  abstract create(post: Post): Promise<void>
  abstract delete(post: Post): Promise<void>
}
