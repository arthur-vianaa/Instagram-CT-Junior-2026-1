import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { FetchOwnPostsUseCase } from './fetch-own-posts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makePost } from 'test/factories/make-post'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: FetchOwnPostsUseCase

describe('Fetch users own posts', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(inMemoryUsersRepository);
    sut = new FetchOwnPostsUseCase(inMemoryPostsRepository);
  })

  it('should be able to fetch users own post', async () => {
    const author = makeUser({}, new UniqueEntityID('123456'))

    await inMemoryUsersRepository.create(author)

    await inMemoryPostsRepository.create(
      makePost({
          authorId: author.id
      })
    )

    const result = await sut.execute({
      authorId: author.id.toString(),
    })

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ authorName: author.name }),
    ])
  })

  it('should be able to fetch users own various posts, by order', async () => {
    const author = makeUser({}, new UniqueEntityID('123456'))

    await inMemoryUsersRepository.create(author)

    await inMemoryPostsRepository.create(
      makePost({
          description: 'Ola Mundo!',
          authorId: author.id,
          data: new Date(2026, 5, 20)
      })
    )

    await inMemoryPostsRepository.create(
      makePost({
          description: 'Eu amo demais a CT',
          authorId: author.id,
          data: new Date(2026, 5, 21)
      })
    )

    const result = await sut.execute({
      authorId: author.id.toString(),
    })

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ description: 'Eu amo demais a CT' }),
      expect.objectContaining({ description: 'Ola Mundo!' }),
    ])
  })
})
