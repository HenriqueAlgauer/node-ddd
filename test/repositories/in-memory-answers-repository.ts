import { AnswerRespository } from "../../src/domain/forum/application/repositories/answer-repository"
import { Answer } from "../../src/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswerRespository {
    public items: Answer[] = []

    async create(answer: Answer) {
        this.items.push(answer)
    }
}