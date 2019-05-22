import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import UUID from 'uuid/v4'
import Purchase from './purchase'

@Entity()
export default class User extends BaseEntity {

	@PrimaryColumn()
	id!: string

	@Column({ unique: true })
	name: string

	@Column({nullable: true})
	avatar?: string

	@OneToMany(type => Purchase, purchase => purchase.payer)
	purchases!: Purchase[]

	@ManyToMany(type => Purchase, purchase => purchase.debtors)
	debts!: Purchase[]

	constructor(name: string) {
		super()

		this.id = UUID()
		this.name = name
	}

	static async createOrGet(name: string): Promise<User> {
		const existent = await User.findOne({ where: { name } })
		return existent
			? existent
			: await new User(name).save()
	}

	static getFromName(name: string, withRelations: boolean = false): Promise<User> {
		return User.findOneOrFail({
			where: { name },
			relations: withRelations ? ['debts', 'purchases'] : undefined,
		})
	}

}