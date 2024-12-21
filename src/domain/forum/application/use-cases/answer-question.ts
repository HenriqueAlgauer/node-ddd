import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswerRespository } from "../repositories/answer-repository"

interface AnswerQuestionUseCaseRequest {
    instructorId: string
    questionId: string
    content: string
}

export class AnswerQuestionUseCase {
    constructor(
        private answerRepository: AnswerRespository,
    ) { }

    async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId),
        })

        await this.answerRepository.create(answer)

        return answer
    }
}