import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { title } from "process";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit a question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-id-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Titulo editado novo',
            content: 'Conteudo novo do edit',
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Titulo editado novo',
            content: 'Conteudo novo do edit'
        })
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-id-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        await expect(() => {
            return sut.execute({
                questionId: newQuestion.id.toValue(),
                authorId: 'author-2',
                title: 'Titulo editado novo',
                content: 'Conteudo novo do edit',
            })
        }).rejects.toBeInstanceOf(Error)
    })
})