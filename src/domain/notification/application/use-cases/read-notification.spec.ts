import { makeNotification } from "../../../../../test/factories/make-notification";
import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notifications-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
    })
    it('should be able to read a notification', async () => {
        const notification = makeNotification()

        await inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
            expect.any(Date)
        )
    })

    it('should not be able to delete a notification from another user', async () => {
        const newNotification = makeNotification({
            recipientId: new UniqueEntityID('recipient-1')
        })

        await inMemoryNotificationsRepository.create(newNotification)

        const result = await sut.execute({
            recipientId: 'recipient-2',
            notificationId: newNotification.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})