import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException } from "@nestjs/common";
import { PostPostUseCase } from "@/domain/application/use-cases/post-post";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";

const sendEmailBodySchema = z.object({
    description: z.string().optional(),
    foto: z.string(),
})

type SendEmailBodySchema = z.infer<typeof sendEmailBodySchema>

@Controller('/post')
export class SendEmailController {
  constructor(private postPost: PostPostUseCase) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: SendEmailBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const { description, foto: fotoLink } = body
    const authorId = user.sub

    const result = await this.postPost.execute({
      authorId,
      description,
      fotoLink,
      data: new Date(),
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}