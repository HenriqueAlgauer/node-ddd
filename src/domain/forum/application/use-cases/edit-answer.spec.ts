import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { makeAnswer } from "../../../../../test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { title } from "process";

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit a answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })
    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-id-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-1',
            content: 'Conteudo novo do edit',
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Conteudo novo do edit'
        })
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-id-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        await expect(() => {
            return sut.execute({
                answerId: newAnswer.id.toValue(),
                authorId: 'author-2',
                content: 'Conteudo novo do edit',
            })
        }).rejects.toBeInstanceOf(Error)
    })
})