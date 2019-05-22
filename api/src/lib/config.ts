import Memiens from 'memiens'

import { rand } from './util'

export const Config = new Memiens('config.yml')

export const JWTConfig = {
	options: {
		algorithm: Config.get('security.jwt.algorithm', 'HS512'),
		expiresIn: Config.get('security.jwt.expiresIn', '90 days'),
	},
	secret: Config.get('security.jwt.secret', rand(128)),
}