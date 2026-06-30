import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { UsersRepository } from "../repositories/users-repository"
import { User } from "@/domain/enterprise/entities/user"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface GetUserProfileUseCaseRequest {
  userId: string
}

type GetUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}