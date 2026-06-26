import { FetchAllRecentPostsUseCase } from "@/domain/application/use-cases/fetch-all-recent-posts";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { PostDetailsPresenter } from "../presenters/post-presenter";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('Ver os posts recentes')
@Controller('/posts')
export class FetchAllRecentPostsController {
  constructor(
    private fetchAllRecentPosts: FetchAllRecentPostsUseCase
  ) { }

  @Get()
  @HttpCode(200)
     @ApiOperation({ summary: 'Retorna um array com todos os posts novos' }) 
  
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
                  authorId: { type: 'string', example: '12f48310-2e8a-4992-b916-aae5bcd3aff1' },
                  description: { type: 'string', example: 'A CT Junior eh a 01!' },
                  fotoLink: { type: 'string', example: 'lindissima-ct-junior.jpeg' },
                  data: { type: 'string', example: '2026-06-26T16:45:00.000Z' },
                }
              }
            }
          }
        }
      })
      @ApiResponse({ status: 401, description: 'Usuario nao autenticado' }) 
     
  async handle(@CurrentUser() user: TokenSchema) {
    const userId = user.sub

    const result = await this.fetchAllRecentPosts.execute({
      receiverId: userId
    })

    if (!result.value) {
      return null
    }

    const posts = result.value.posts

    return { posts: posts.map(post => PostDetailsPresenter.toHTTP(post)) }
  }
}