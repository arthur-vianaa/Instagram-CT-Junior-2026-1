import { PostsRepository } from "@/domain/application/repositories/posts-repository";
import { Post } from "@/domain/enterprise/entities/post";
import { Injectable } from "@nestjs/common";
import { PrismaEmailMapper } from "../mappers/prisma-email-mapper";
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

    return PrismaEmailMapper.toDomain(post)
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
      content: post.content,
      authorID: post.authorID,
      description: post.description,
      fotoLink: post.fotoLink,
      authorName: author.name,
      authorProfilePicture: author.profileImage ?? ''
      },
      post.id
    )
  }

  async findManyByReceiverId(receiverId: string): Promise<PostWithAuthor[]> {
    const emails = await this.prisma.email.findMany({
      where: { receiverId },
      include: { sender: true, receiver: true },
      orderBy: { data: 'desc' },
    })

    return emails.map((email) => PostWithAuthor.create({
      emailId: new UniqueEntityID(email.id),
      title: email.title,
      content: email.content,
      createdAt: email.data,
      isSeen: email.isSeen,
      senderId: new UniqueEntityID(email.senderId),
      senderName: email.sender.name,
      senderEmail: email.sender.email,
      receiverId: new UniqueEntityID(email.receiverId),
      receiverName: email.receiver.name,
      receiverEmail: email.receiver.email,
    }))
  }

  async findManyBySenderId(senderId: string): Promise<PostWithAuthor[]> {
    const emails = await this.prisma.email.findMany({
      where: { senderId },
      include: { sender: true, receiver: true },
      orderBy: { data: 'desc' },
    })

    return emails.map((email) => PostWithAuthor.create({
      emailId: new UniqueEntityID(email.id),
      title: email.title,
      content: email.content,
      createdAt: email.data,
      isSeen: email.isSeen,
      senderId: new UniqueEntityID(email.senderId),
      senderName: email.sender.name,
      senderEmail: email.sender.email,
      receiverId: new UniqueEntityID(email.receiverId),
      receiverName: email.receiver.name,
      receiverEmail: email.receiver.email,
    }))
  }

  async create(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.create({
      data,
    })
  }

  async save(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.update({
      where: {
        id: email.id.toString(),
      },
      data,
    })
  }

  async delete(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.delete({
      where: {
        id: data.id,
      }
    })
  }

}