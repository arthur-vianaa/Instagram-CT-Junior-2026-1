import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { PostDetailsPresenter } from "../presenters/post-presenter";
import { FetchOwnPostsUseCase } from "@/domain/application/use-cases/fetch-own-posts";

@Controller('/my-posts')
export class FetchOwnPostsController {
  constructor(
    private fetchOwnPosts: FetchOwnPostsUseCase
  ) { }

  @Get()
  @HttpCode(200)
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