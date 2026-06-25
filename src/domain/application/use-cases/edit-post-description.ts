import { Post } from "@/domain/enterprise/entities/post"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

interface EditPostDescriptionUseCaseRequest {
    authorId: string
    postId: string
    description: string
}

type EditPostDescriptionUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError, 
    {
        post: Post
    }
>

@Injectable()
export class EditPostDescriptionUseCase {
    constructor(private postsRepository: any) { }

    async execute({
        authorId,
        postId,
        description
    }: EditPostDescriptionUseCaseRequest): Promise<EditPostDescriptionUseCaseResponse> {
        const post = await this.postsRepository.findById(postId)

        if (!post) {
            return left(new ResourceNotFoundError())
        }

        if (post.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        post.changeDescription(description)

        await this.postsRepository.save(post)

        return right({
            post
        })
    }
}