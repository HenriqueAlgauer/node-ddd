import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Find a Question by slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to fetch questions', async () => {
        await inMemoryQuestionsRepository.create(
            makeQuestion({ createdAt: new Date(2022, 0, 20) })
        )
        await inMemoryQuestionsRepository.create(
            makeQuestion({ createdAt: new Date(2022, 0, 18) })
        )
        await inMemoryQuestionsRepository.create(
            makeQuestion({ createdAt: new Date(2022, 0, 24) })
        )

        const result = await sut.execute({
            page: 1
        })

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 24) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) })
        ])
    })

    it('should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepository.create(makeQuestion())
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.value?.questions).toHaveLength(2)
    })
})