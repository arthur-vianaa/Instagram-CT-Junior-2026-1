import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PostProps {
  data: Date       
  content: string
  authorID: UniqueEntityID
  description?: string
  fotoLink: string
}

export class Post extends Entity<PostProps> {
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

  get id() {
    return super.id 
  }

  static create(
    props: Optional<PostProps, 'data'>,
    id?: UniqueEntityID
  ) {
    const post = new Post(
      {
        ...props,
        data: props.data ?? new Date(),
      },
      id
    )
    return post
  }
}
