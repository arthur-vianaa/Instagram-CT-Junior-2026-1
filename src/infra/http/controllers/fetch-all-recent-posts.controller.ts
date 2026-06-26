import { FetchAllRecentPostsUseCase } from "@/domain/application/use-cases/fetch-all-recent-posts";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { PostDetailsPresenter } from "../presenters/post-presenter";

@Controller('/posts')
export class FetchAllRecentPostsController {
  constructor(
    private fetchAllRecentPosts: FetchAllRecentPostsUseCase
  ) { }

  @Get()
  @HttpCode(200)
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