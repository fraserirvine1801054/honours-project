// Base imports
import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Menu from './core/Menu';
// Page component imports
import Visualise from './react-components/Visualise';
import Home from './core/Home';

const MainRouter = () => {

    return(
        <div>
            <Menu />
            <Switch>
                <Route path='/' component={Home}/>
                <Route path='/visualise/:data_id' component={Visualise}/>
            </Switch>
        </div>
    );
}
export default MainRouter;