import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Post, PostProps } from '@/domain/enterprise/entities/post'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPostMapper } from '@/infra/database/prisma/mappers/prisma-post-mapper'
import { Injectable } from '@nestjs/common'

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID
) {
  const post = Post.create(
    {
      description: faker.lorem.sentence(),
      fotoLink: faker.lorem.text(),
      authorID: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return post
}

@Injectable()
export class PostFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaPost(
    data: Partial<PostProps> = {},
  ): Promise<Post> {
    const post = makePost(data)

    await this.prisma.post.create({
      data: PrismaPostMapper.toPrisma(post),
    })

    return post
  }
}
