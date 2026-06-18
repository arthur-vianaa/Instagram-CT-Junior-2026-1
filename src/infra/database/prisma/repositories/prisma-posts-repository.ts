import { PostsRepository } from "@/domain/application/repositories/posts-repository";
import { Post } from "@/domain/enterprise/entities/post";
import { Injectable } from "@nestjs/common";
import { PrismaPostMapper } from "../mappers/prisma-post-mapper";
import { PrismaService } from "../prisma.service";
import { PostWithAuthor } from "@/domain/enterprise/entities/value-objects/post-with-author-props";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      }
    })

    if (!post) {
      return null
    }

    return PrismaPostMapper.toDomain(post)
  }

  async findDetailsById(id: string): Promise<PostWithAuthor | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!post) {
      return null
    }

    return PostWithAuthor.create({
      data: post.data,
      description: post.description ?? undefined,
      authorID: new UniqueEntityID(post.author
      .id),
      fotoLink: post.fotoLink,
      authorName: post.author.name,
      authorProfilePicture: post.author.profileImage ?? ''
    },
    new UniqueEntityID(post.id) 
    )
  }

  async findManyByAuthorId(authorID: string): Promise<PostWithAuthor[]> {
    const posts = await this.prisma.post.findMany({
      where: { authorID: authorID },
      include: { author: true },
      orderBy: { data: 'desc' },
    })

    return posts.map((post) => PostWithAuthor.create({
      data: post.data,
      description: post.description ?? undefined,
      authorID: new UniqueEntityID(post.author.id),
      fotoLink: post.fotoLink,
      authorName: post.author.name,
      authorProfilePicture: post.author.profileImage ?? ''
    },
    new UniqueEntityID(post.id)  
    ))
  }

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.post.create({
      data,
    })
  }

  async save(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.post.update({
      where: {
        id: post.id.toString(),
      },
      data,
    })
  }

  async delete(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.post.delete({
      where: {
        id: data.id,
      }
    })
  }

}