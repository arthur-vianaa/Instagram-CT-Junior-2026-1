import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterUserBodyDto {
  @ApiProperty({ 
    description: 'Nome do usuario', 
    example: 'Andre Scheffer' 
  })
  username!: string

  @ApiProperty({ 
    description: 'Endereco de e-mail unico para o cadastro', 
    example: 'andre.scheffer@ctjunior.com' 
  })
  email!: string

  @ApiPropertyOptional({ 
    description: 'Foto de Perfil (opcional)', 
    example: 'andreschefao.jpeg' 
  })
  foto?: string

  @ApiProperty({ 
    description: 'Senha de acesso (6+ caracteres)', 
    example: '123456',
    format: 'password' 
  })
  senha!: string
}