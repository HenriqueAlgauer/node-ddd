import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })
    it('should be able to answer a question', async () => {

        const result = await sut.execute({
            questionId: '1',
            instructorId: 'New answer',
            content: 'Conteudo da resposta',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    })
})