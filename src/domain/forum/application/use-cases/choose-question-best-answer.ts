import { Either, left, right } from "../../../../core/either"
import { Question } from "../../enterprise/entities/question"
import { AnswersRepository } from "../repositories/answers-repository"
import { QuestionsRepository } from "../repositories/questions-repository"
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found"

interface ChooseBestAnswerUseCaseRequest {
    answerId: string
    authorId: string
}

type ChooseBestAnswerUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, { question: Question }>

export class ChooseBestAnswerUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private answerRepository: AnswersRepository,
    ) { }

    async execute({
        answerId, authorId
    }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionsRepository.findById(
            answer.questionId.toString()
        )

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return right({
            question
        })
    }
}