import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "../../../../../test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionAttachmentRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

        sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository)
    })
    it('should be able to comment on question', async () => {
        const question = makeQuestion()

        await inMemoryQuestionsRepository.create(question)

        await sut.execute({
            authorId: question.authorId.toString(),
            questionId: question.id.toString(),
            content: 'comentário teste',
        })

        expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('comentário teste')
    })

})