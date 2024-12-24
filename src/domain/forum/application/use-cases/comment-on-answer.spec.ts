import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { makeAnswer } from "../../../../../test/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "../../../../../test/repositories/in-memory-answer-comments-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

        sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository)
    })
    it('should be able to comment on answer', async () => {
        const answer = makeAnswer()

        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            authorId: answer.authorId.toString(),
            answerId: answer.id.toString(),
            content: 'comentário teste',
        })

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('comentário teste')
    })

})