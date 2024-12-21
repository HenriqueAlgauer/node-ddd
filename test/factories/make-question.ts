import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import { Question, QuestionProps } from "../../src/domain/forum/enterprise/entities/question";
import { Slug } from "../../src/domain/forum/enterprise/entities/value-objects/slug";

export function makeQuestion(
    override: Partial<QuestionProps> = {}
) {
    const question = Question.create({
        authorId: new UniqueEntityID(),
        title: 'Example question',
        slug: Slug.create('example-question'),
        content: 'Example content',
        ...override
    })

    return question
}