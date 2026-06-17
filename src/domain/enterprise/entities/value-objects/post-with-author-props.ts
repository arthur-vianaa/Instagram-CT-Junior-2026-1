import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Entity } from "@/core/entities/entity";

export interface PostWithAuthorProps {
  data: Date       
  content: string
  authorID: UniqueEntityID
  description?: string
  fotoLink: string
  authorName: string    
  authorProfilePicture: string  
}

export class PostWithAuthor extends Entity<PostWithAuthorProps> {
  get data() {
    return this.props.data
  }

  get content() {
    return this.props.content
  }

  get authorID() {
    return this.props.authorID
  }

  get fotoLink() {
    return this.props.fotoLink
  }

  get description() {
    return this.props.description
  }

  get authorName() {
    return this.props.authorName
  }
  
  get authorProfilePicture() {
    return this.props.authorProfilePicture
  }

  static create(props: PostWithAuthorProps, id?: UniqueEntityID) {
    const postWithAuthor = new PostWithAuthor(props, id)
    return postWithAuthor
  }
}