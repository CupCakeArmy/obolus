import { randomBytes } from 'crypto'

export function rand(length = 32): string {
	return randomBytes(length / 2).toString('hex')
}