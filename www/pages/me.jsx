import React from 'react'

import Layout from '../components/layout'
import { callAPI } from '../utils/api'
import { capitalize, getAvatarOfFallback } from '../utils/misc'
import { withAuthSync } from '../utils/auth'


const avatars = ['anteater', 'bear', 'beaver', 'boar', 'buffalo-1', 'buffalo', 'cat', 'chicken', 'cow', 'crow', 'dog-1', 'dog', 'donkey', 'elephant', 'fox', 'giraffe', 'hedgehog', 'hen', 'hippopotamus', 'horse', 'kangaroo', 'koala', 'leopard', 'lion', 'marten', 'monkey-1', 'monkey', 'mouse', 'octopus', 'ostrich', 'owl', 'panda', 'parrot', 'penguin-1', 'penguin', 'pig', 'polar-bear', 'rabbit', 'racoon', 'rhinoceros', 'rooster', 'seagull', 'seal', 'sheep-1', 'sheep', 'sloth', 'snake', 'tiger', 'whale', 'zebra']

const selectAvatar = avatar => callAPI(null, {
    url: `/api/users/me/avatar`,
    method: 'post',
    data: { avatar },
}).then(() => location.reload()).catch(() => alert('There was a problem deleting the purchase'))

const Me = me => {

    const { name, debts, purchases, avatar } = me

    return <Layout>
        <h1>{capitalize(name)}</h1>

        <h5>Current Avatar</h5>
        <img alt="avatar-icon" src={`/static/icons/animals/${getAvatarOfFallback(avatar)}.svg`}
             className="avatar avatar-xl"/>

        <br/><br/>

        <h5>Select Avatar</h5>
        <div className={'selector'}>
            {avatars.map((avatar, i) => <img
                onClick={() => selectAvatar(avatar)}
                key={i} alt="avatar-icon"
                src={`/static/icons/animals/${avatar}.svg`}
                className="avatar avatar-md m-1"
            />)}
        </div>

        {/*<br/><br/>*/}
        {/*<h2>Purchases</h2>*/}
        {/*{purchases.map((purchase, i) => <Purchase key={i} {...{ purchase, me }} />)}*/}

        {/*<br/><br/>*/}
        {/*<h2>Debts</h2>*/}
        {/*{debts.map((purchase, i) => <Purchase key={i} {...{ purchase, me }} />)}*/}

        {/* language=CSS */}
        <style jsx>{`
            .selector img {
                cursor: pointer;
                transition: var(--animation);
            }

            .selector img:hover {
                transform: scale(1.1);
            }
        `}</style>

    </Layout>
}

Me.getInitialProps = async ctx => await callAPI(ctx, { url: `/api/users/me` })

export default withAuthSync(Me)
