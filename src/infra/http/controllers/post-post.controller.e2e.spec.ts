
import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from "test/factories/make-user"

describe('Post Post (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /post', async () => {
    const user = await userFactory.makePrismaUser(
      {
        email: "carlosdrummond@exemple.com",
      }
    )

    await userFactory.makePrismaUser(
      {
        email: "claricelispector@exemple.com"
      }
    )

    const access_token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/post')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        foto: 'memorias-postumas-de-brasil-cubas.jpeg'
      })

    expect(response.statusCode).toBe(201)

    const postOnDatabase = await prisma.post.findFirst({
      where: {
        fotoLink: 'memorias-postumas-de-brasil-cubas.jpeg',
      },
    })

    expect(postOnDatabase?.authorId).toBe(user.id.toString())
  })
})
