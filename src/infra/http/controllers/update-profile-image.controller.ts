import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Patch, UnauthorizedException } from "@nestjs/common";
import { UpdateProfileImageUseCase } from "@/domain/application/use-cases/update-profile-image";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const updateProfileImageBodySchema = z.object({
  profileImage: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProfileImageBodySchema)

type UpdateProfileImageBodySchema = z.infer<typeof updateProfileImageBodySchema>

@ApiTags('Editar Imagem de Perfil')
@Controller('/user')
export class UpdateProfileImageController {
  constructor(private updateProfileImage: UpdateProfileImageUseCase) { }

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edita a imagem de perfil do usuario' }) 
  @ApiBody({ 
      description: 'Foto de Perfil Nova',
      examples: {
        exemplo: { 
          value: { 
            profileImage: 'Foto-que-a-ct-esta-nos-devendo.jpeg'
          } 
        }
      }
    })
    @ApiResponse({ status: 204, description: 'Foto atualizada com sucesso' }) 
    @ApiResponse({ status: 401, description: 'Nao permitido (tentando trocar de outro user / sem autenticacao)' }) 
    
  async handle(
    @Body(bodyValidationPipe) body: UpdateProfileImageBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const { profileImage } = body
    const userId = user.sub
    const result = await this.updateProfileImage.execute({
      userId,
      profileImage,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}