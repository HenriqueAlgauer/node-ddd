import { Entity } from "../../../../core/entities/entity"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"

export interface QuestionComentProps {
    authorId: UniqueEntityID
    questionId: UniqueEntityID
    content: string
    createdAt: Date
    updateAt?: Date
}

export class QuestionComent extends Entity<QuestionComentProps> {
    get authorId() {
        return this.props.authorId
    }
    get content() {
        return this.props.content
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updateAt() {
        return this.props.updateAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    private touch() {
        this.props.updateAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    static create(props: Optional<QuestionComentProps, 'createdAt'>, id?: UniqueEntityID) {
        const questionComent = new QuestionComent({
            ...props,
            createdAt: props.createdAt ?? new Date()
        }, id)

        return questionComent
    }
}
