import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { PostPostUseCase } from './post-post'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: PostPostUseCase

describe('Create a Post', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(inMemoryUsersRepository)

    sut = new PostPostUseCase(
      inMemoryPostsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to create a post', async () => {
    const author = makeUser()

    await inMemoryUsersRepository.create(author)

    const result = await sut.execute({
      description: 'Eu amo a CT Junior',
      fotoLink: 'fotolindapretaelarnja.jpeg',
      authorId: author.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      post: inMemoryPostsRepository.items[0],
    })
  })

  it('should not be able to send a post if the user doesnt exist', async () => {
    
    const result = await sut.execute({
      description: 'Eu odeio a CT Junior',
      fotoLink: 'fotolindapretaelarnja.jpeg',
      authorId: new UniqueEntityID().toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
