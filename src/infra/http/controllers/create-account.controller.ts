import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterUserBodyDto } from '../dto/register.dto'

export const createAccountSchema = z
  .object({
    username: z.string().nonempty(),
    profileImage: z.string().optional(),
    email: z.email(),
    senha: z.string().min(6),
  })

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@ApiTags('Usuario')
@Controller('/user')
@Public()
export class CreateAccountController {
  constructor(
    private createUser: RegisterUserUseCase,
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @ApiOperation({ summary: 'Realiza o cadastro do usuario' }) 
  @ApiBody({ 
    type: RegisterUserBodyDto,
    description: 'Dados necessários para o cadastro do usuário'
  })
  @ApiResponse({ status: 201, description: 'Usuario cadastrado com sucesso' }) 
  @ApiResponse({ status: 409, description: 'Conflito (e-mail ou nome ja utilizados)' }) 
  async handle(@Body() body: CreateAccountBodySchema) {
    const { username: name, profileImage, email, senha: password } = body
    const result = await this.createUser.execute({
      name,
      email,
      profileImage,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw new BadRequestException(error);
    }
  }
}