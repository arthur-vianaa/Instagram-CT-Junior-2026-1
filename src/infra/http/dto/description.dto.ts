import { ApiProperty } from '@nestjs/swagger'

export class ChangePostDescriptionDto {
  @ApiProperty({ 
    description: 'Nova descricao para alterar o post', 
    example: 'A CT JUNIOR EH A 01 DAS 01S!' 
  })
  description!: string

}
