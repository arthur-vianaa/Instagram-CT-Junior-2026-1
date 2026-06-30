import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode, NotFoundException } from "@nestjs/common";
import { GetUserProfileUseCase } from "@/domain/application/use-cases/get-user-profile";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserPresenter } from "../presenters/user-presenter";

@ApiTags('Usuario')
@ApiBearerAuth('jwt')
@Controller('/profile')
export class GetUserProfileController {
  constructor(
    private getUserProfile: GetUserProfileUseCase
  ) { }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Retorna o perfil do usuario atualmente autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do perfil retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: 'Perfil do usuario',
          properties: {
            id: { type: 'string', example: '8f3b26c4-72de-4f3a-965d-1763e0fa4b12' },
            name: { type: 'string', example: 'Andre Scheffer' },
            email: { type: 'string', example: 'andre.scheffer@ctjunior.com' },
            profileImage: { type: 'string', example: 'andre-perfil.jpeg', nullable: true }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario nao autenticado' }) 
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' }) 
      
  async handle(@CurrentUser() user: TokenSchema) {
    const userId = user.sub

    const result = await this.getUserProfile.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      return null
    }

    const { user: userEntity } = result.value

    return { user: UserPresenter.toHTTP(userEntity) }
  }
}