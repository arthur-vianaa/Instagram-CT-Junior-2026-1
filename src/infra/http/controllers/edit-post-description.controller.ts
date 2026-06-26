import z from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe"
import { BadRequestException, Body, Controller, HttpCode, Param, Patch, UnauthorizedException } from "@nestjs/common"
import { EditPostDescriptionUseCase } from "@/domain/application/use-cases/edit-post-description"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import type { TokenSchema } from "@/infra/auth/jwt.strategy"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

// 1. Corrigido para aceitar a descrição conforme a regra do PDF
const editPostDescriptionBodySchema = z.object({
  description: z.string().nullable(), 
})

type EditPostDescriptionBodySchema = z.infer<typeof editPostDescriptionBodySchema>

@Controller('/post/:id')
export class EditPostDescriptionController {
  constructor(private editPostDescription: EditPostDescriptionUseCase) { }

  @Patch()
  @HttpCode(204)
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