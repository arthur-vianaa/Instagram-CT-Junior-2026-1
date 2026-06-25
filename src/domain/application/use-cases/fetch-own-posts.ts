import { Either, right } from '@/core/either'
import { PostsRepository } from '../repositories/posts-repository'
import { PostWithAuthor } from '@/domain/enterprise/entities/value-objects/post-with-author-props'
import { Injectable } from '@nestjs/common'

interface FetchOwnPostsUseCaseRequest {
  authorId: string
}

type FetchOwnPostsUseCaseResponse = Either<
  null,
  {
    posts: PostWithAuthor[]
  }
>

@Injectable()
export class FetchOwnPostsUseCase {
  constructor(private postsRepository: PostsRepository) { }

  async execute({
    authorId,
  }: FetchOwnPostsUseCaseRequest): Promise<FetchOwnPostsUseCaseResponse> {
    const posts = await this.postsRepository.findManyByAuthorId(authorId)

    return right({
      posts,
    })
  }
}
