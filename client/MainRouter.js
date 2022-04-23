// Base imports
import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Menu from './core/Menu';
import Home from './core/Home';
import SearchPage from './search/SearchPage';
import PackageView from './packageview/PackageView';
import Visualisation from './visualisation/Visualisation';
// Page component imports
//import Visualise from './react-components/Visualise';


const MainRouter = () => {
    return(
        <div>
            <Menu />
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/search' component={SearchPage}/>
                <Route path='/packageview/:package_id' component={PackageView}/>
                <Route path='/visualisation/:dataid' component={Visualisation}/>
            </Switch>
        </div>
    );
}
/*
<Route path='/visualise/:data_id' component={Visualise}/>
*/

export default MainRouter;