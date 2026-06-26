import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { PostFactory } from "test/factories/make-post"
import { UserFactory } from "test/factories/make-user"

describe('Edit Post Description (E2E)', () => {
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

  test('[PATCH] /post/:id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Andre Scheffer'
    })


    const post = await postFactory.makePrismaPost({
      authorId: user.id,
      fotoLink: 'foto.jpeg'
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })


    const response = await request(app.getHttpServer())
      .patch(`/post/${post.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'Ola Mundo!',
      })

    expect(response.statusCode).toBe(204)


    const postOnDatabase = await prisma.post.findUnique({
      where: {
        id: post.id.toString(),
      },
    })

    expect(postOnDatabase?.description).toBe('Ola Mundo!')
  })
})