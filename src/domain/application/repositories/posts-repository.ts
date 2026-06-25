import { Post } from '@/domain/enterprise/entities/post'
import { PostWithAuthor } from '@/domain/enterprise/entities/value-objects/post-with-author-props';

export abstract class PostsRepository {
  abstract findById(id: string): Promise<Post | null> // Encontra o post a partir do ID
  abstract findDetailsById(id: string): Promise<PostWithAuthor | null> // Encontra o post a partir do ID, retorna mais detalhes 
  abstract findManyRecent(): Promise<PostWithAuthor[]>
  abstract findManyByAuthorId(authorId: string): Promise<PostWithAuthor[]> // Encontra posts a partir do ID do autor
  abstract create(post: Post): Promise<void> // Cria um novo post
  abstract save(post: Post): Promise<void> // Salva alteracoes em um post 
  abstract delete(post: Post): Promise<void> // Deleta um post
}
