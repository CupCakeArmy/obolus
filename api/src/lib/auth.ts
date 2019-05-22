import JWT from 'jsonwebtoken'
import { Middleware } from 'koa'

import User from '../entities/user'
import { JWTConfig } from './config'
import { FailureUnauthorized } from './responses'

type AuthenticatedState = {
	user: User
}

export const withAuth: (mw: Middleware<AuthenticatedState>) => Middleware = (mw) => async (ctx, next) => {
	const header = ctx.req.headers['authorization']

	if (!header)
		return FailureUnauthorized(ctx, 'Authorization header missing')

	try {
		const token = header.slice(`Bearer `.length)
		const { user } = JWT.verify(token, JWTConfig.secret) as any
		// Throws error if user is not found
		ctx.state = { user: await User.getFromName(user) }
	} catch (e) {
		return FailureUnauthorized(ctx, 'Invalid token')
	}

	// Call middleware
	return await mw(ctx, next)
}