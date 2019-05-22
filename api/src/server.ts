require('reflect-metadata')

import Koa from 'koa'
import Parser from 'koa-bodyparser'
import { join } from 'path'
import { createConnection } from 'typeorm'

import Purchase from './entities/purchase'
import User from './entities/user'
import { Config } from './lib/config'
import { responseTime } from './lib/middleware'
import router from './routes'


createConnection({
	type: 'sqlite',
	database: join(process.cwd(), 'db.sqlite'),
	// type: "mysql",
	// host: "localhost",
	// port: 3306,
	// username: 'test',
	// password: 'test',
	// database: 'data',
	entities: [User, Purchase],
	synchronize: true,
}).then(async () => {

	// Initialize users
	const allowedUsers = Config.get<string[]>('users')
	for (const user of allowedUsers) {
		await User.createOrGet(user)
	}

	const port = Config.get<number>('server.port')
	const server = new Koa()

	server.use(responseTime)
	server.use(Parser())
	server.use(router.routes())
	server.use(router.allowedMethods())
	server.listen(port)
	console.log(`> Server Stared 🚀`)
})