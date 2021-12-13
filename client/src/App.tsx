import { css, Global } from '@emotion/react';
import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Signup } from './pages/Signup';

interface AppProps {}
export const App: React.FC<AppProps> = () => {
    const GlobalStyles = css`
        /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
        .js-focus-visible :focus:not([data-focus-visible-added]) {
            outline: none;
            box-shadow: none;
        }
    `;

    return (
        <Fragment>
            <Global styles={GlobalStyles} />
            <Switch>
                <Route path='/signup' exact>
                    <Signup />
                </Route>
                <Route path='/' exact>
                    <Login />
                </Route>
                <Route path='/home' exact>
                    <Home />
                </Route>
                {/* <Route path='/premium'>
                            <Premium />
                        </Route> */}
                <Route path='*' component={NotFound} />
            </Switch>
        </Fragment>
    );
};

export default App;
