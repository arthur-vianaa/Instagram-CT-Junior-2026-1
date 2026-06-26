import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateUserBodyDto {
  @ApiProperty({ 
    description: 'Endereco de e-mail unico para o cadastro', 
    example: 'andre.scheffer@ctjunior.com' 
  })
  email!: string

  @ApiProperty({ 
    description: 'Senha de acesso (6+ caracteres)', 
    example: '123456',
    format: 'password' 
  })
  senha!: string
}