import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { DataBaseModule } from "../database/database.module";
import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { UpdateProfileImageController } from "./controllers/update-profile-image.controller";
import { UpdateProfileImageUseCase } from "@/domain/application/use-cases/update-profile-image";
import { EditPostDescriptionController } from "./controllers/edit-post-description.controller";
import { SendEmailController } from "./controllers/post-post.controller";
import { PostPostUseCase } from "@/domain/application/use-cases/post-post";
import { DeletePostController } from "./controllers/delete-post.controller";
import { DeletePostUseCase } from "@/domain/application/use-cases/delete-post";
import { FetchAllRecentPostsController } from "./controllers/fetch-all-recent-posts.controller";
import { FetchAllRecentPostsUseCase } from "@/domain/application/use-cases/fetch-all-recent-posts";
import { FetchOwnPostsController } from "./controllers/fetch-own-posts.controller";
import { FetchOwnPostsUseCase } from "@/domain/application/use-cases/fetch-own-posts";
import { EditPostDescriptionUseCase } from "@/domain/application/use-cases/edit-post-description";

@Module({
  imports: [
    DataBaseModule,
    CryptographyModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    UpdateProfileImageController,
    EditPostDescriptionController,
    SendEmailController,
    DeletePostController,
    FetchAllRecentPostsController,
    FetchOwnPostsController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    UpdateProfileImageUseCase,
    PostPostUseCase,
    DeletePostUseCase,
    FetchOwnPostsUseCase,
    FetchAllRecentPostsUseCase,
    EditPostDescriptionUseCase,
  ]
})
export class HTTPModule { }