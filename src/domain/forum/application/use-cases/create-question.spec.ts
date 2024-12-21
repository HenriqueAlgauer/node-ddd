import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { CreateQuestionUseCase } from "./create-question";

const fakeQuestionRepository: QuestionsRepository = {
    create: async (question: Question) => {
        return
    },
}

test('create a question', async () => {
    const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository)

    const { question } = await createQuestion.execute({
        authorId: '1',
        title: 'New Question',
        content: 'Conteudo da pergunta',
    })

    expect(question.id).toBeTruthy()
})