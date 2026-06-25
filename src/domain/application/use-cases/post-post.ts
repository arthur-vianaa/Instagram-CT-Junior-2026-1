import { Either, left, right } from '@/core/either'
import { Post } from '@/domain/enterprise/entities/post'
import { PostsRepository } from '../repositories/posts-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface PostPostUseCaseRequest {
  authorId: string
  description: string
  fotoLink: string
}

type PostPostUseCaseResponse = Either<
  NotAllowedError,
  {
    post: Post
  }
>

@Injectable()
export class PostPostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    authorId,
    description,
    fotoLink,
  }: PostPostUseCaseRequest): Promise<PostPostUseCaseResponse> {
    const authorExists = await this.usersRepository.findById(authorId.toString())

    if (!authorExists) {
      return left(new NotAllowedError())
    }

    const post = Post.create({
      authorId: new UniqueEntityID(authorId),
      description,
      fotoLink,
      data: new Date(),
    })

    await this.postsRepository.create(post)

    return right({
      post,
    })
  }
}
