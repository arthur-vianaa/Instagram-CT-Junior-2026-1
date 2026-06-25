import { InMemoryPostsRepository } from "test/repositories/in-memory-posts-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { EditPostDescriptionUseCase } from "./edit-post-description"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makePost } from "test/factories/make-post"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: EditPostDescriptionUseCase

describe('Edit Post Description', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(inMemoryUsersRepository)
    sut = new EditPostDescriptionUseCase(inMemoryPostsRepository)
  })

  it('should be able to edit a posts description', async () => {

    const user = (
        makeUser( 
        {},
        new UniqueEntityID('123456')
        )
    )

    await inMemoryUsersRepository.create(user)

    const post = (
        makePost(
            {
                authorId: user.id,
            }
        )
    )

    await inMemoryPostsRepository.create(post)

    const result = await sut.execute({
        authorId: '123456',
        postId: post.id.toString(),
        description: 'Nova descrição do post'       
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPostsRepository.items[0].description).toEqual('Nova descrição do post')
  })

  it('shouldnt be able to edit a non-existing posts description', async () => {

    const userID = new UniqueEntityID()
    const post = (
        makePost(
            {
                authorId: userID
            }
        )
    )

    await inMemoryPostsRepository.create(post)

    const result = await sut.execute({
        authorId: userID.toString(),
        postId: '0000',
        description: 'Nova descrição do post'       
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('shouldnt be able to edit another users posts description', async () => {

    const user = (
        makeUser( 
        {},
        new UniqueEntityID('123456')
        )
    )

    const postOwner = (
        makeUser(
            {},
            new UniqueEntityID('654321')
        )
    )

    await inMemoryUsersRepository.create(user)
    await inMemoryUsersRepository.create(postOwner)

    const post = (
        makePost(
            {
                authorId: postOwner.id,
            }
        )
    )

    await inMemoryPostsRepository.create(post)

    const result = await sut.execute({
    authorId: 'user',
    postId: post.id.toString(),
    description: 'Tentando hackear a legenda!!'       
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryPostsRepository.items[0].description).not.toBe('Tentando hackear a legenda!!')
  })


})