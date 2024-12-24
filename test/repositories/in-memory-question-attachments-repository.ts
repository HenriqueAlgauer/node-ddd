import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "../../src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "../../src/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository implements QuestionAttachmentsRepository {
    public items: QuestionAttachment[] = []

    async findById(id: string) {
        const questionAttachment = this.items.find(item => item.id.toString() === id)

        if (!questionAttachment) {
            return null
        }

        return questionAttachment
    }

    async findManyByQuestionId(questionId: string) {
        const questionAttachment = this.items
            .filter(item => item.questionId.toString() === questionId)

        return questionAttachment
    }
}