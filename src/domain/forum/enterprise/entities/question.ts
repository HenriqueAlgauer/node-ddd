import { Slug } from "./value-objects/slug"
import { Entity } from "../../../../core/entities/entity"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"
import dayjs from "dayjs"

export interface QuestionProps {
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID
    title: string
    content: string
    slug: Slug
    createdAt: Date
    updateAt?: Date
}

export class Question extends Entity<QuestionProps> {

    get content() {
        return this.props.content
    }

    get authorId() {
        return this.props.authorId
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    get title() {
        return this.props.title
    }

    get slug() {
        return this.props.slug
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updateAt() {
        return this.props.updateAt
    }

    get isNew(): boolean {
        return dayjs().diff(this.createdAt, 'days') <= 3
    }

    private touch() {
        this.props.updateAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    set title(title: string) {
        this.props.title = title
        this.props.slug = Slug.createFromText(title)

        this.touch()
    }

    set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
        this.props.bestAnswerId = bestAnswerId
        this.touch()
    }

    static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityID) {
        const question = new Question({
            ...props,
            slug: props.slug ?? Slug.createFromText(props.title),
            createdAt: new Date()
        }, id)

        return question
    }
}
