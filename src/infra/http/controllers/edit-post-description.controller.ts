import z from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { BadRequestException, Body, Controller, HttpCode, Param, Patch, UnauthorizedException } from "@nestjs/common"
import { EditPostDescriptionUseCase } from "@/domain/application/use-cases/edit-post-description"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { TokenSchema } from "@/infra/auth/jwt.strategy"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger"

const editPostDescriptionBodySchema = z.object({
  description: z.string().nullable(), 
})

type EditPostDescriptionBodySchema = z.infer<typeof editPostDescriptionBodySchema>


@ApiTags('Editar a descricao de um post')
@Controller('/post/:id')
export class EditPostDescriptionController {
  constructor(private editPostDescription: EditPostDescriptionUseCase) { }

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edita a descricao de um post' }) 
  @ApiBody({ 
      description: 'Nova descricao',
      examples: {
        exemplo: { 
          value: { 
            description: 'A CT Junior eh a 01 das 01s!'
          } 
        }
      }
    })
    @ApiResponse({ status: 204, description: 'Descricao atualizada com sucesso' }) 
    @ApiResponse({ status: 401, description: 'Nao permitido (tentando trocar de outro user / sem autenticacao)' }) 
    
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

      throw new BadRequestException(error)
    }
  }
}