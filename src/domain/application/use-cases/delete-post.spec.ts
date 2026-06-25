import { DeletePostUseCase } from './delete-post'
import { makePost } from 'test/factories/make-post'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: DeletePostUseCase

describe('Delete Post', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(inMemoryUserRepository)
    sut = new DeletePostUseCase(inMemoryPostsRepository)
  })

  it('should be able to delete a post', async () => {
    await inMemoryPostsRepository.create(
      makePost(
        {
          authorID: new UniqueEntityID('123456'),
        },
        new UniqueEntityID('post-01')
      )
    )

    await sut.execute({
      authorId: '123456',
      postId: 'post-01',
    })

    expect(inMemoryPostsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a post from another user ', async () => {
    await inMemoryPostsRepository.create(
      makePost(
        {
          authorID: new UniqueEntityID('123456'),
        },
        new UniqueEntityID('post-01')
      )
    )

    const result = await sut.execute({
      authorId: 'wrong',
      postId: 'post-01',
    })

    expect(inMemoryPostsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

    it('should not be able to delete a post that doesnt exist ', async () => {

    const result = await sut.execute({
      authorId: '123456!',
      postId: 'schizophrenic-post',
    })

    expect(inMemoryPostsRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    
  })
})
