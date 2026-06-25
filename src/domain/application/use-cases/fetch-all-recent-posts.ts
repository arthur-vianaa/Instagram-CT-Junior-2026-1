import { Either, right } from '@/core/either'
import { PostsRepository } from '../repositories/posts-repository'
import { PostWithAuthor } from '@/domain/enterprise/entities/value-objects/post-with-author-props'
import { Injectable } from '@nestjs/common'

interface FetchAllRecentPostsUseCaseRequest {
}

type FetchAllRecentPostsUseCaseResponse = Either<
  null,
  {
    posts: PostWithAuthor[]
  }
>

@Injectable()
export class FetchAllRecentPostsUseCase {
  constructor(private postsRepository: PostsRepository) { }

  async execute({
  }: FetchAllRecentPostsUseCaseRequest): Promise<FetchAllRecentPostsUseCaseResponse> {
    const posts = await this.postsRepository.findManyRecent()

    return right({
      posts,
    })
  }
}
