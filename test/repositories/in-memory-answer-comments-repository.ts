import { AnswerCommentsRepository } from "../../src/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "../../src/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
    public items: AnswerComment[] = []

    async create(answerComment: AnswerComment) {
        this.items.push(answerComment)
    }
}