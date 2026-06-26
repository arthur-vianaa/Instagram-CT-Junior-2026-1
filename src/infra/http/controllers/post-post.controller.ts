import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException } from "@nestjs/common";
import { PostPostUseCase } from "@/domain/application/use-cases/post-post";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { PostPostBodyDto } from "../dto/post.dto";

const postPostBodySchema = z.object({
    description: z.string().optional(),
    foto: z.string(),
})

type PostPostBodySchema = z.infer<typeof postPostBodySchema>

@ApiTags('Post')
@ApiBearerAuth('jwt')
@Controller('/post')
export class SendEmailController {
  constructor(private postPost: PostPostUseCase) { }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Posta um novo post no banco de dados' }) 
    @ApiBody({ 
        type: PostPostBodyDto
      })
      @ApiResponse({ status: 201, description: 'Post feito com sucesso!' }) 
      @ApiResponse({ status: 401, description: 'Usuario nao autenticado' }) 
      
  async handle(
    @Body(new ZodValidationPipe(postPostBodySchema)) body: PostPostBodySchema,
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