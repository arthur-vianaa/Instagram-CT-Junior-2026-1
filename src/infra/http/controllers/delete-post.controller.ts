import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { DeletePostUseCase } from "@/domain/application/use-cases/delete-post";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('Deletar um post')
@Controller('/post/:id')
export class DeletePostController {
  constructor(private deletePost: DeletePostUseCase) { }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Deleta um post' }) 
  @ApiResponse({ status: 200, description: 'Foto atualizada com sucesso' }) 
  @ApiResponse({ status: 401, description: 'Nao permitido (tentando trocar de outro user / sem autenticacao)' }) 
  @ApiResponse({ status: 404, description: 'Post nao encontrado!' }) 
      
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