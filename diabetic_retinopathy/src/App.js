import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import {UserPrediction,UserRegistration} from './UserManager'
import {Confidence} from './Confidence'
import './dr.css'



class RouteComponent extends Component{

	render(){
		return(
			<div>
			 <Switch>
      		<Route path='/user' component={UserRegistration} />
      		<Route path='/test/:id' exact strict component={UserPrediction} />
          <Route path = '/confidence/:id' exact strict component={Confidence}/>
      		</Switch>
      		</div>
			)
	}

}




class App extends Component {
  render() {
    return (
      <div style={{backgroundImage:"14020.jpg"}}>
      <script crossOrigin='true'/>
      <BrowserRouter>
      <RouteComponent/>
      </BrowserRouter>
      
      </div>
    );
  }
}

export default App;
