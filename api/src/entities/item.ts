import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import UUID from 'uuid/v4'

@Entity()
export default class Item extends BaseEntity {

	@PrimaryColumn()
	id!: string

	@Column()
	text: string

	@Column()
	done: boolean

	constructor(text: string, done: boolean = false) {
		super()

		this.id = UUID()
		this.text = text
		this.done = done
	}

}