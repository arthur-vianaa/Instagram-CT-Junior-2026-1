import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { PostFactory } from "test/factories/make-post"
import { UserFactory } from "test/factories/make-user"

describe('Delete Post (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let postFactory: PostFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory, PostFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    postFactory = moduleRef.get(PostFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /post/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    })

    const postId = post.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/post/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    const postOnDatabase = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    expect(postOnDatabase).toBeNull()
  })
})