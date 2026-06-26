import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateUserBodyDto } from "../dto/auth.dto";

const authenticateBodySchema = z.object({
  email: z.email(),
  senha: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Usuario')
@Controller('/login')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiBody({ 
    type: AuthenticateUserBodyDto,
    description: 'Credenciais obrigatorias para login'
  })
  @ApiResponse({ status: 200, description: 'Autenticacao realizada com sucesso, retorna o token JWT' })
  @ApiResponse({ status: 401, description: 'Credenciais (email/senha) incorretos' })
  @ApiResponse({ status: 400, description: 'Erro de validacao dos campos enviados.' })
  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, senha: password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}