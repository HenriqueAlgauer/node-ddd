import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "../../../../../test/factories/make-question-attachments";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit a question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)

        sut = new EditQuestionUseCase(
            inMemoryQuestionsRepository,
            inMemoryQuestionAttachmentRepository
        )
    })
    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-id-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            }),
        )

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Titulo editado novo',
            content: 'Conteudo novo do edit',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Titulo editado novo',
            content: 'Conteudo novo do edit'
        })

        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-id-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-2',
            title: 'Titulo editado novo',
            content: 'Conteudo novo do edit',
            attachmentsIds: []
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})