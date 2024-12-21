import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { ChooseBestAnswerUseCase } from "./choose-question-best-answer";
import { makeAnswer } from "../../../../../test/factories/make-answer";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseBestAnswerUseCase

describe('Choose Question best answer', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()

        sut = new ChooseBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository)
    })
    it('should be able to choose the question best answer', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({
            questionId: question.id,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString()
        })

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
    })

    it('should not be able to choose another best answer question', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        })

        const answer = makeAnswer({
            questionId: question.id,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        expect(() => {
            return sut.execute({
                authorId: 'author-2',
                answerId: answer.id.toString()
            })
        }).rejects.toBeInstanceOf(Error)
    })
})