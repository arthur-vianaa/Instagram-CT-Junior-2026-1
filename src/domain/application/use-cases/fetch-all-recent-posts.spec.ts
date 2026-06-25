import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { FetchAllRecentPostsUseCase } from './fetch-all-recent-posts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makePost } from 'test/factories/make-post'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: FetchAllRecentPostsUseCase

describe('Fetch all recent posts', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(inMemoryUsersRepository);
    sut = new FetchAllRecentPostsUseCase(inMemoryPostsRepository);
  })

  it('should be able to fetch a recently made post', async () => {
    const author = makeUser({}, new UniqueEntityID('123456'))

    await inMemoryUsersRepository.create(author)

    await inMemoryPostsRepository.create(
      makePost({
          authorID: author.id
      })
    )

    const result = await sut.execute({})

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ authorName: author.name }),
    ])
  })

  it('should be able to fetch various posts, by order', async () => {
    const author1 = makeUser({}, new UniqueEntityID('123456'))
    const author2 = makeUser({}, new UniqueEntityID('654321'))

    await inMemoryUsersRepository.create(author1)
    await inMemoryUsersRepository.create(author2)

    await inMemoryPostsRepository.create(
      makePost({
          description: 'Ola Mundo!',
          authorID: author1.id,
          data: new Date(2026, 5, 20)
      })
    )

    await inMemoryPostsRepository.create(
      makePost({
          description: 'Eu amo demais a CT',
          authorID: author2.id,
          data: new Date(2026, 5, 21)
      })
    )

    await inMemoryPostsRepository.create(
      makePost({
          description: 'Backend e melhor que front',
          authorID: author1.id,
          data: new Date(2026, 5, 19)
      })
    )

    const result = await sut.execute({})

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ description: 'Eu amo demais a CT' }),
      expect.objectContaining({ description: 'Ola Mundo!' }),
      expect.objectContaining({ description: 'Backend e melhor que front' }),
    ])
  })
})
