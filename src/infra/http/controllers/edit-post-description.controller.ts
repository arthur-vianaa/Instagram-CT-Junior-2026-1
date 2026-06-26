import z from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { BadRequestException, Body, Controller, HttpCode, Param, Patch, UnauthorizedException, NotFoundException } from "@nestjs/common"
import { EditPostDescriptionUseCase } from "@/domain/application/use-cases/edit-post-description"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { TokenSchema } from "@/infra/auth/jwt.strategy"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error" 
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { ChangePostDescriptionDto } from "../dto/description.dto"

const editPostDescriptionBodySchema = z.object({
  description: z.string().nullable(), 
})

type EditPostDescriptionBodySchema = z.infer<typeof editPostDescriptionBodySchema>

@ApiTags('Post')
@ApiBearerAuth('jwt')
@Controller('/post')
export class EditPostDescriptionController {
  constructor(private editPostDescription: EditPostDescriptionUseCase) { }

  @Patch('/:id') 
  @HttpCode(204)
  @ApiOperation({ summary: 'Edita a descrição de um post' }) 
  @ApiBody({ 
      type: ChangePostDescriptionDto
    })
    @ApiResponse({ status: 204, description: 'Descricao atualizada com sucesso' }) 
    @ApiResponse({ status: 401, description: 'Nao permitido (Tentando alterar post de outro usuario)' }) 
    @ApiResponse({ status: 404, description: 'Post nao encontrado' }) 
    
  async handle(
    @Body(new ZodValidationPipe(editPostDescriptionBodySchema)) body: EditPostDescriptionBodySchema,
    @Param('id') postId: string, 
    @CurrentUser() user: TokenSchema,
  ) {
    const { description } = body
    const authorId = user.sub

    const result = await this.editPostDescription.execute({
      postId,
      authorId,
      description: description || null,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message)
      }

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}