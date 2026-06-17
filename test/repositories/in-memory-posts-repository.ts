import { PostsRepository } from '@/domain/application/repositories/posts-repository'
import { Post } from '@/domain/enterprise/entities/post'
import { PostWithAuthor } from '@/domain/enterprise/entities/value-objects/post-with-author-props';
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryPostsRepository implements PostsRepository {
  public items: Post[] = []

  constructor(private usersRepository: InMemoryUsersRepository) { }

  async findById(id: string): Promise<Post | null> {
    const post = this.items.find((item) => item.id.toString() === id)

    if (!post) {
      return null
    }

    return post
  }

  async findDetailsById(id: string): Promise<PostWithAuthor | null> {
    const post = this.items.find((item) => item.id.toString() === id)

    if (!post) {
      return null
    }

    const author = this.usersRepository.items.find((user) => user.id.equals(post.authorID))

    if (!author) {
      throw new Error('User not found in memory repository during mapping.')
    }

    return PostWithAuthor.create({
      data: post.data,
      content: post.content,
      authorID: post.authorID,
      description: post.description,
      fotoLink: post.fotoLink,
      authorName: author.name,
      authorProfilePicture: author.profileImage ?? ''
      },
    post.id
    )
  }

  async findManyByAuthorId(authorID: string): Promise<PostWithAuthor[]> {
    const Posts = this.items
      .filter((item) => item.authorID.toString() === authorID)
      .sort((a, b) => b.data.getTime() - a.data.getTime())

    return this.mapPostsToDetails(Posts)
  }

  async create(post: Post): Promise<void> {
    this.items.push(post)
  }

  async save(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = post
    }
  }

  async delete(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id))

    this.items.splice(itemIndex, 1)
  }

  private mapPostsToDetails(Posts: Post[]): PostWithAuthor[] {
    return Posts.map((post) => {
      const author = this.usersRepository.items.find((user) => user.id.equals(post.authorID))

      if (!author) {
        throw new Error('User not found in memory repository during mapping.')
      }

    return PostWithAuthor.create({
      data: post.data,
      content: post.content,
      authorID: post.authorID,
      description: post.description,
      fotoLink: post.fotoLink,
      authorName: author.name,
      authorProfilePicture: author.profileImage ?? ''
      },
    post.id
    )}
  )}
}
