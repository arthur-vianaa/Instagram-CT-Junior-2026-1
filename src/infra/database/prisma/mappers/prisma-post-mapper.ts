import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Post } from "@/domain/enterprise/entities/post";
import { Prisma, Post as PrismaPost } from "@prisma/client";

export class PrismaPostMapper {
  static toDomain(raw: PrismaPost): Post {
    return Post.create(
      {
        data: raw.data,
        authorId: new UniqueEntityID(raw.authorId), 
        description: raw.description,
        fotoLink: raw.fotoLink,
      }, 
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      id: post.id.toString(),
      data: post.data,
      description: post.description || null, 
      authorId: post.authorId.toString(),
      fotoLink: post.fotoLink,
    }
  }
}