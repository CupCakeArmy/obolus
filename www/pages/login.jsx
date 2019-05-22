import React, { useState } from 'react'

import Layout from '../components/layout'
import { login } from '../utils/auth'
import { callAPI } from '../utils/api'
import { capitalize } from '../utils/misc'


const Login = ({ users }) => {

    const [user, setUser] = useState(users[0])
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        callAPI(null, {
            method: 'post',
            url: '/api/users/login',
            data: { user, password },
        })
            .then(login)
            .catch(() => setError(true))
    }

    return <Layout>
        <form onSubmit={handleSubmit}>

            <div className={`form-group ${error ? 'has-error' : ''}`}>
                <select className="form-select"
                        name='username'
                        placeholder="username"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                >
                    {users.map((username, i) => <option key={i} value={username}>{capitalize(username)}</option>)}
                </select>

                <label className="form-label" htmlFor="input-example-1">Password</label>
                <input
                    className="form-input"
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br/>
                <button type='submit' className={'btn btn-primary'}>Login</button>
                {error && <React.Fragment><br/><p className="form-input-hint">Unauthorized</p></React.Fragment>}
            </div>

        </form>
    </Layout>
}

Login.getInitialProps = async ctx => ({
    users: await callAPI(ctx, { url: `/api/users/names` }),
})

export default Login
