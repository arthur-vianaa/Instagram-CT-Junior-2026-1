import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PostPostBodyDto {
  @ApiPropertyOptional({ 
    description: 'Descricao do post (opcional)', 
    example: 'Eu adoro pintar o cabelo, a barba e o bigode' 
  })
  description?: string

  @ApiProperty({ 
    description: 'Foto da Postagem', 
    example: 'bluezao.jpeg',
  })
  foto!: string
}