import React from 'react'

import Layout from '../components/layout'
import { callAPI } from '../utils/api'
import { withAuthSync } from '../utils/auth'
import Chart from '../components/chart'
import Purchase from '../components/purchase'


const deletePurchase = id => callAPI(null, {
    url: `/api/purchases/${id}`,
    method: 'delete',
}).then(() => location.reload()).catch(() => alert('There was a problem deleting the purchase'))


const Home = ({ purchases, stats, me }) => {

    return <Layout>
        <h3 className={'text-center'}>summa</h3>

        <Chart stats={stats}/>

        <br/><br/>

        <h4 className={'text-center'}>diarium</h4>
        <div className={'pl-2'}>
            {purchases.map((purchase, i) => <Purchase key={i} {...{ purchase, me }}/>)}
        </div>
    </Layout>
}

Home.getInitialProps = async ctx => ({
    stats: await callAPI(ctx, { url: '/api/purchases/stats' }),
    purchases: await callAPI(ctx, { url: `/api/purchases/` }),
    me: await callAPI(ctx, { url: '/api/users/me' }),
})

export default withAuthSync(Home)
