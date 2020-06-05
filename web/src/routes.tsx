import {Route, BrowserRouter} from 'react-router-dom'
import React from 'react'
import Home from './pages/Home'
import NewPoint from './pages/NewPoint'

const routes = ()=>{
    return(
        <BrowserRouter>
            <Route exact component={Home} path='/'></Route>
            <Route component={NewPoint} path="/newpoint"></Route>
        </BrowserRouter>
    )
}

export default routes