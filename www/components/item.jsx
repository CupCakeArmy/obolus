import { callAPI } from '../utils/api'
import React from 'react'


const Item = ({ id, text, done, refresh }) => {

    const _done = (e) => callAPI(null, {
        url: `/api/items/${id}`,
        method: 'patch',
        data: {
            done: e.target.checked,
        },
    }).then(refresh)

    const _delete = (e) => callAPI(null, {
        url: `/api/items/${id}`,
        method: 'delete',
    }).then(refresh)

    return <tr className="item">
        <td className="item-done">
            <div className="form-group">
                <label className="form-checkbox">
                    <input type="checkbox" checked={done} onChange={_done}/>
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
                        <a onClick={_delete}>
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

export default Item