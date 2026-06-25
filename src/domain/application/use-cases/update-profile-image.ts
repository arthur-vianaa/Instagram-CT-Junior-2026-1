import { Either, left, right } from '@/core/either'
import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateProfileImageUseCaseRequest {
  userId: string
  profileImage: string
}

type UpdateProfileImageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class UpdateProfileImageUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    profileImage,
  }: UpdateProfileImageUseCaseRequest): Promise<UpdateProfileImageUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.profileImage = profileImage

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
