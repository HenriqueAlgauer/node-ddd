import { AnswerRepository } from "../../src/domain/forum/application/repositories/answer-repository"
import { Answer } from "../../src/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswerRepository {
    public items: Answer[] = []

    async findById(id: string) {
        const answer = this.items.find(item => item.id.toString() === id)

        if (!answer) {
            return null
        }

        return answer
    }

    async create(answer: Answer) {
        this.items.push(answer)
    }

    async delete(answer: Answer): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === answer.id)

        this.items.splice(itemIndex, 1)
    }
}