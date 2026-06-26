import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { PostDetailsPresenter } from "../presenters/post-presenter";
import { FetchOwnPostsUseCase } from "@/domain/application/use-cases/fetch-own-posts";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('Post')
@ApiBearerAuth('jwt')
@Controller('/my-posts')
export class FetchOwnPostsController {
  constructor(
    private fetchOwnPosts: FetchOwnPostsUseCase
  ) { }

  @Get()
  @HttpCode(200)
   @ApiOperation({ summary: 'Retorna um array com os posts novos feitos pelo usuario' }) 

    @ApiResponse({ 
      status: 200, 
      description: 'Retorna um array de posts recentes',
      schema: {
        type: 'object',
        properties: {
          posts: {
            type: 'array',
            description: 'Lista de posts',
            items: {
              type: 'object',
              properties: {
                username: { type: 'string', example: 'Joao Subtil' },
                  post_photo: { type: 'string', example: 'lindissima-ct-junior.jpeg'},
                  description: { type: 'string', example: 'A CT Junior eh a 01!' },
                  user_photo: { type: 'string', example: 'joao.jpeg' },
                  post_id: {type: 'string', example: "0227b724-8fad-4d6d-98d5-25a01de6b6b6"}
              }
            }
          }
        }
      }
    })
    @ApiResponse({ status: 401, description: 'Usuario nao autenticado' }) 
        
  async handle(@CurrentUser() user: TokenSchema) {
    const userId = user.sub

    const result = await this.fetchOwnPosts.execute({
      authorId: userId
    })

    if (!result.value) {
      return null
    }

    const posts = result.value.posts

    return { posts: posts.map(post => PostDetailsPresenter.toHTTP(post)) }
  }
}