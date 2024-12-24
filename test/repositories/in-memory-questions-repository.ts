import { DomainEvents } from "../../src/core/events/domain-events";
import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "../../src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "../../src/domain/forum/application/repositories/questions-repository";
import { Question } from "../../src/domain/forum/enterprise/entities/question";
import { QuestionAttachment } from "../../src/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = []


    constructor(
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) { }

    async findById(id: string) {
        const question = this.items.find(item => item.id.toString() === id)

        if (!question) {
            return null
        }

        return question
    }

    async findBySlug(slug: string) {
        const question = this.items.find(item => item.slug.value === slug)

        if (!question) {
            return null
        }

        return question
    }

    async findManyRecent({ page }: PaginationParams) {
        const questions = this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);

        return questions
    }

    async create(question: Question) {
        this.items.push(question)

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async save(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items[itemIndex] = question

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async delete(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items.splice(itemIndex, 1)

        this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString())
    }
}