import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { makeAnswer } from "../../../../../test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "../../../../../test/factories/make-answer-attachment";

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit a answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        sut = new EditAnswerUseCase(
            inMemoryAnswersRepository, inMemoryAnswerAttachmentRepository
        )
    })
    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-id-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswerAttachmentRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            }),
        )

        await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-1',
            content: 'Conteudo novo do edit',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Conteudo novo do edit'
        })
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-id-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-2',
            content: 'Conteudo novo do edit',
            attachmentsIds: ['1', '2']
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})