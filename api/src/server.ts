require('reflect-metadata')

import Koa from 'koa'
import Parser from 'koa-bodyparser'
import { join } from 'path'
import { createConnection } from 'typeorm'

import Item from './entities/item'
import Purchase from './entities/purchase'
import User from './entities/user'
import { Config } from './lib/config'
import { responseTime } from './lib/middleware'
import router from './routes'


createConnection({
	type: 'sqlite',
	database: join(process.cwd(), 'db.sqlite'),
	entities: [User, Purchase, Item],
	synchronize: true,
}).then(async () => {

	// Initialize users
	const allowedUsers = Config.get<string[]>('users')
	for (const user of allowedUsers) {
		await User.createOrGet(user)
	}

	const port = process.env.NODE_ENV !== 'production'
		? 5000
		: 80
	const server = new Koa()

	server.use(responseTime)
	server.use(Parser())
	server.use(router.routes())
	server.use(router.allowedMethods())
	server.listen(port)
	console.log(`> Server Stared 🚀`)
})