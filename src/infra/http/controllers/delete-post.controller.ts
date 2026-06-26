import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { DeletePostUseCase } from "@/domain/application/use-cases/delete-post";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, ForbiddenException, HttpCode, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/post/:id')
export class DeletePostController {
  constructor(private deletePost: DeletePostUseCase) { }

  @Delete()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenSchema,
    @Param('id') postId: string,
  ) {
    const userId = user.sub

    const result = await this.deletePost.execute({
      authorId: userId,
      postId,
    })

    if (result.isLeft()) {

      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}