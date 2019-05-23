import React, { useEffect, useRef, useState } from 'react'

import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'
import { callAPI } from '../utils/api'


const Item = ({ id, text, done }) => {

    const handleDone = async (e) => {
        await callAPI(null, {
            url: `/api/items/${id}`,
            method: 'patch',
            data: {
                done: e.target.checked,
            },
        })
        window.location.reload()
    }

    const handleDelete = async (e) => {
        await callAPI(null, {
            url: `/api/items/${id}`,
            method: 'delete',
        })
        window.location.reload()
    }

    return <tr className="item">
        <td className="item-done">
            <div className="form-group">
                <label className="form-checkbox">
                    <input type="checkbox" checked={done} onChange={handleDone}/>
                    <i className="form-icon"/>
                </label>
            </div>
        </td>
        <td>{text}</td>
        <td className="item-menu">
            <div className="dropdown dropdown-right">
                <a className="btn btn-link dropdown-toggle" tabIndex="0">
                    <i className="icon icon-more-vert"/>
                </a>
                <ul className="menu">
                    <li className="menu-item">
                        <a onClick={handleDelete}>
                            <i className="icon icon-delete"/> Delete
                        </a>
                    </li>
                </ul>
            </div>
        </td>
        {/* language=CSS */}
        <style jsx>{`
            .item-done,
            .item-menu {
                width: 2em;
            }
        `}</style>
    </tr>
}

const List = ({ items }) => {

    const input = useRef(undefined)
    const [text, setText] = useState('')

    useEffect(() => {
        if (!input.current) return
        input.current.focus()
    }, [input])

    const submit = async () => {
        await callAPI(null, {
            url: `/api/items/`,
            method: 'post',
            data: { text },
        })
        window.location.reload()
    }

    const deleteAll = async () => {
        await callAPI(null, {
            url: `/api/items/`,
            method: 'delete',
        })
        window.location.reload()
    }

    return <Layout>
        <form onSubmit={submit}>
            <div className="input-group">
                <input
                    type="text" className="form-input" placeholder="..." ref={input}
                    value={text} onChange={e => setText(e.target.value)}/>
                <button type="submit" className="btn btn-primary input-group-btn">Add</button>
            </div>
        </form>
        <br/>
        <table className="table table-hover">
            <tbody>
            {items.map((item, i) => <Item key={i} {...item} />)}
            </tbody>
        </table>
        <br/>
        <button onClick={deleteAll} className="btn btn-error">Delete All</button>
    </Layout>
}

List.getInitialProps = async ctx => ({
    items: await callAPI(ctx, { url: `/api/items` }),
})

export default withAuthSync(List)