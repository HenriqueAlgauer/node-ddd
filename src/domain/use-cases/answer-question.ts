import { Answer } from "../entities/answer"
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

    execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
        const answer = new Answer({
            content,
            authorId: instructorId,
            questionId,
        })

        return answer
    }
}