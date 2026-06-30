import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from "test/factories/make-user"

describe('Get User Profile (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /profile', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Andre Scheffer',
      email: 'andre.scheffer@ctjunior.com',
      profileImage: 'foto-de-perfil.jpeg'
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: 'Andre Scheffer'
      })
    })
  })

})