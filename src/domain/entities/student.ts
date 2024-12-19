import { Entity } from "../../core/entities/entity"

interface StudentProps {
    name: string
}

export class Student extends Entity {
    public name: string

    constructor(props: StudentProps, id?: string) {
        super(id)
        this.name = props.name
    }
}