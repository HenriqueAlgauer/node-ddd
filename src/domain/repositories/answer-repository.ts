import { Answer } from "../entities/answer";

export interface AnswerRespository {
    create(answer: Answer): Promise<void>
}