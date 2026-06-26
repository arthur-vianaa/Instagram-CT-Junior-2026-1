import { ApiProperty } from '@nestjs/swagger'

export class ChangePfpBodyDto {
  @ApiProperty({ 
    description: 'Nova foto de perfil', 
    example: 'bluezao1.jpeg' 
  })
  profileImage!: string
}