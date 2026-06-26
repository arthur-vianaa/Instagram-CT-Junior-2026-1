import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { PostFactory } from "test/factories/make-post"
import { UserFactory } from "test/factories/make-user"

describe('Fetch all recent posts (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let postFactory: PostFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory, PostFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    postFactory = moduleRef.get(PostFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /posts', async () => {
    const author = await userFactory.makePrismaUser({
      name: 'Fernando Pessoa',
    })
    const otherAuthor = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: author.id.toString() })

    await Promise.all([
      postFactory.makePrismaPost({
        authorId: author.id,
        fotoLink: 'foto-01.jpeg',
      }),
      postFactory.makePrismaPost({
        authorId: otherAuthor.id,
        fotoLink: 'foto-02.jpeg',
      }),
      postFactory.makePrismaPost({
        authorId: author.id,
        fotoLink: 'foto-03.jpeg',
      })
    ])

    const response = await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          post_photo: 'foto-01.jpeg',
          username: 'Fernando Pessoa',
        }),
        expect.objectContaining({
          post_photo: 'foto-02.jpeg',
        }),
        expect.objectContaining({
          post_photo: 'foto-03.jpeg',
          username: 'Fernando Pessoa',
        }),
      ])
    })
  })
})