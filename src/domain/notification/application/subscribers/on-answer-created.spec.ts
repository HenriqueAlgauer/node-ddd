import { makeAnswer } from "../../../../../test/factories/make-answer"
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { OnAnswerCreated } from "./on-answer-created"

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('On answer created', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
    })
    it('Should send a notification when an answer is created', async () => {
        const onAnswerCreated = new OnAnswerCreated()

        const answer = makeAnswer()

        inMemoryAnswerRepository.create(answer)
    })
})