import React, { useRef, useState } from 'react'
import Router from 'next/router'

import Layout from '../components/layout'
import { withAuthSync } from '../utils/auth'
import { callAPI } from '../utils/api'


const Profile = props => {

    const { users } = props

    const check = useRef(undefined)
    const [photo, setPhoto] = useState(undefined)
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [debtors, setDebtors] = useState(users.reduce((acc, users) => {
        acc[users.name] = true
        return acc
    }, {}))

    const removeUpload = () => {
        setPhoto(false)
    }

    const handlePhoto = e => {
        const reader = new FileReader()

        reader.onload = e => {
            const converted = Buffer.from(e.target.result).toString('base64')
            check.current.src = `data:image/jpeg;base64,${converted}`
            setPhoto(converted)
        }
        reader.readAsArrayBuffer(e.target.files[0])
    }

    const submit = async (e) => {
        e.preventDefault()

        console.log(e.files)
        const selectedDebtors = Object.entries(debtors)
            .filter(([name, selected]) => selected)
            .map(([name, selected]) => name)

        await callAPI(null, {
            url: `/api/purchases`,
            method: 'post',
            data: {
                price: parseFloat(price),
                debtors: selectedDebtors,
                description,
            },
        })
        Router.push('/')
    }

    return <Layout>
        <h1>Add New</h1>

        <form onSubmit={submit}>

            <div className="form-group">
                <label className="form-label">Price</label>
                <input
                    className="form-input"
                    placeholder={'Price'}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    type={'number'} min={0} step={0.01}
                />
                <br/>
                <input
                    className="form-input"
                    placeholder={'I haz bought...'}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <br/>
                {photo
                    ? <button onClick={removeUpload} type={'button'} className="btn btn-primary">Delete Photo</button>
                    : <div className="fileUpload btn btn-primary">
                        <span>Upload a Photo</span>
                        <input
                            type="file"
                            onChange={handlePhoto}
                        />
                    </div>
                }
            </div>

            <div className="form-group">
                {users.map(({ name }, i) => <label key={i} className="form-checkbox form-inline">
                    <input
                        type="checkbox"
                        checked={debtors[name]}
                        onChange={e => setDebtors({ ...debtors, [name]: e.target.checked })}
                    />
                    <i className="form-icon"/> {name}
                </label>)}
            </div>

            <img ref={check} id="check" alt="file upload check" style={{ display: photo ? 'initial' : 'none' }}/>

            <button type={'submit'} className="btn btn-primary">Save</button>
        </form>

        {/* language=CSS */}
        <style jsx>{`

            img#check {
                width: 100%;
            }

            .fileUpload {
                position: relative;
                overflow: hidden;
            }

            .fileUpload input {
                position: absolute;
                top: 0;
                right: 0;
                margin: 0;
                padding: 0;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                filter: alpha(opacity=0);
            }
        `}</style>

    </Layout>
}

Profile.getInitialProps = async ctx => ({
    users: await callAPI(ctx, { url: `/api/users/` }),
})

export default withAuthSync(Profile)
