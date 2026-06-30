import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase 

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })


  it('should be able to get a user profile', async () => {

    const newUser = makeUser({
      name: 'Andre Scheffer',
      email: 'andre.scheffer@ctjunior.com',
    })

    await inMemoryUsersRepository.create(newUser)


    const result = await sut.execute({
      userId: newUser.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({
        name: 'Andre Scheffer',
        email: 'andre.scheffer@ctjunior.com',
      }),
    })
  })


  it('should not be able to get a profile from a non-existing user', async () => {
    const result = await sut.execute({
      userId: 'id-inexistente',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})