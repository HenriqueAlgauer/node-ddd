import { Answer } from "../../enterprise/entities/answer";

export interface AnswerRespository {
    create(answer: Answer): Promise<void>
}