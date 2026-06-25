import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { PostsRepository } from '../repositories/posts-repository'
import { Injectable } from '@nestjs/common'

interface DeletePostUseCaseRequest {
  authorId: string
  postId: string
}

type DeletePostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeletePostUseCase {
  constructor(private postsRepository: PostsRepository) { }

  async execute({
    authorId,
    postId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId)

    if (!post) {
      return left(new ResourceNotFoundError())
    }

    if (post.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.postsRepository.delete(post)

    return right(null)
  }
}
