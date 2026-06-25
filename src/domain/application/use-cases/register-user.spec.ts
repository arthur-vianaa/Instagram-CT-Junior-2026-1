import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserUseCase } from './register-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should not be able to register a user with an existing email', async () => {
    const user1 = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'Fernando Pessoa 2',
      email: 'fernandopessoa@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register a user with an existing username', async () => {
    const user1 = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa2@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should be able to set user profile image upon registration', async () => {
    const result = await sut.execute({
      name: 'Fernando Pessoa',
      email: 'fernandopessoa@example.com',
      password: '123456',
      profileImage: 'google.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].profileImage).toEqual('google.com')
  })
})
