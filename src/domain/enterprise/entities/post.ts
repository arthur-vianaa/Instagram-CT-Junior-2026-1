import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PostProps {
  data: Date       
  authorId: UniqueEntityID
  description: string | null 
  fotoLink: string
}

export class Post extends Entity<PostProps> {
  get data() {
    return this.props.data
  }

  get authorId() {
    return this.props.authorId
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

  changeDescription(description: string) {
    this.props.description = description
  }
}
