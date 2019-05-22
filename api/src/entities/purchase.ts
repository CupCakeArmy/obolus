import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import UUID from 'uuid/v4'

import User from './user'

@Entity()
export default class Purchase extends BaseEntity {

	@PrimaryColumn()
	id!: string

	@Column('real')
	price: number

	@Column()
	description: string

	@Column()
	when: number

	@Column('blob', { nullable: true })
	photo?: string

	@ManyToOne(type => User, user => user.purchases, { eager: true })
	payer: User

	@ManyToMany(type => User, user => user.debts, { eager: true })
	@JoinTable()
	debtors: User[]

	constructor(price: number, payer: User, debtors: User[], description = '') {
		super()

		this.id = UUID()
		this.price = price
		this.payer = payer
		this.debtors = debtors
		this.description = description
		this.when = Date.now()
	}

	static async getCurrentStats() {

		// @ts-ignore
		const users: { [user: string]: number } = Object.fromEntries((await User.find()).map(user => [user.name, 0]))
		const all: Purchase[] = await Purchase.find()

		for (const { price, debtors, payer, description } of all) {
			const each: number = price / debtors.length

			for (const debtor of debtors)
				users[debtor.name] -= each

			users[payer.name] += price
		}

		// Sum of all the calculations, should be 0.
		const _error = Object.values(users).reduce((acc, cur) => acc + cur, 0)

		// @ts-ignore
		const approximated = Object.fromEntries(Object.entries(users).map(([name, value]) => [name, Number(value.toFixed(2))]))

		return {
			_error,
			...approximated,
		}
	}
}