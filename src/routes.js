import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';
import SignUp from './pages/SignUp';
import ContextProvider from './components/Provider';
import SignIn from './pages/SignIn';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/' , state: { from: props.location } }} />
        )
    )} />
);

const MainRoutes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={() => <SignIn/>} />
            <Route path="/SignUp" component={() => <SignUp/>} />
            <PrivateRoute path='/app' component={() => <ContextProvider/>}/>
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default MainRoutes;