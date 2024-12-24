import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })
    it('should be able to answer a question', async () => {

        const result = await sut.execute({
            questionId: '1',
            instructorId: 'New answer',
            content: 'Conteudo da resposta',
            attachmentsIds: ['1', '2']
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
        ])
    })
})