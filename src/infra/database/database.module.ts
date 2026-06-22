import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaPostsRepository } from "./prisma/repositories/prisma-posts-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { PostsRepository } from "@/domain/application/repositories/posts-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PostsRepository,
  ],
})
export class DataBaseModule { }