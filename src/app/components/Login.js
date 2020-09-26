import React , {Component} from 'react'
import {BrowserRouter, Route, Switch}  from 'react-router-dom'
import LoginForm from './LoginForm'
import SingupForm from './SingupForm'


class Login extends Component{

    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginForm}/>
                    <Route path="/register" component={SingupForm}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Login