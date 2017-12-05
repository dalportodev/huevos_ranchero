import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/App.css';
import { Alert, Form, FormControl, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

//import { Link } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			registering: false,
			loginError: false,
			registerError: false,
			invalidLoginError: false,
			usernameExistsError: false
		};

		this.btnText = "Log in";
		this.btnStyle = "success";
    // This binding is necessary to make `this` work in the callback
    this.switchLogin = this.switchLogin.bind(this);
    this.logInButton = this.logInButton.bind(this);
    this.dismissLoginError = this.dismissLoginError.bind(this);
    this.dismissRegisterError = this.dismissRegisterError.bind(this);
    this.dismissInvalidLoginError = this.dismissInvalidLoginError.bind(this);
    this.dismissUsernameExistsError = this.dismissUsernameExistsError.bind(this);
}

dismissLoginError(){
	this.setState(
	{
		loginError: false
	});
}

dismissRegisterError(){
	this.setState(
	{
		registerError: false
	});
}

dismissInvalidLoginError(){
	this.setState(
	{
		invalidLoginError: false
	});
}

dismissUsernameExistsError(){
	this.setState(
	{
		usernameExistsError: false
	});
}

navigate(){
	this.props.history.replaceState(null, "/");
}

componentWillMount(){
	if(this.props.isLoggedIn){
		this.props.history.push("/members");
	} 
}

switchLogin() {
	if(this.state.registering){
		this.btnText = "Log in";
		this.btnStyle = "success";
		this.setState(({
			registerError: false,
			invalidLoginError: false
		}));
	} else {
		this.btnText = "Register";
		this.btnStyle = "primary";
		this.setState(({
			loginError: false,
			invalidLoginError: false
		}));
	}

	this.setState(prevState => ({
		registering: !prevState.registering
	}));
}

login() {
	var that = this;
	let base64 = require('base-64');
	let data = {
		username: base64.encode(this.loginInput.value),
		password: base64.encode(this.passwordInput.value)
	}
	var login = new Request('http://localhost:3001/api/login', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(data)
	});

	fetch(login)
	.then((response) => response.json())
	.then((res) => {
		if(res.success === true){
			//alert("hi");
			var username = res.message;

			that.props.dispatch({type: 'LOGGED_IN_TRUE'});
			that.props.dispatch({type: 'GET_USERNAME', username})
			that.props.history.push("/members");

		} else {
			that.setState(({
				invalidLoginError: true,
				loginError: false
			}));
		}
	});
}

register(){
	//REGISTER
	var that = this;
	let data = {
		username: this.loginInput.value,
		password: this.passwordInput.value,
		first_name: this.firstNameInput.value,
		last_name: this.lastNameInput.value
	}

	var checkUsername = new Request('http://localhost:3001/api/check-username?username=' + data.username, {
		method: 'GET'
	});

	var registerUser = new Request('http://localhost:3001/api/new-user', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(data)
	});

	fetch(checkUsername)
	.then(function(response){
		response.json()
		.then(function(data){
			let success = data.success;
			if(!success){
				fetch(registerUser)
				.then(function(response) {
					if(response.status === 400){
						that.setState(({
							usernameExistsError: true,
							registerError: false
						}));
				} else if(response.status === 200){
					alert("Registered");
					that.login();
				}
			});
			} else {
				that.setState(({
					usernameExistsError: true,
					registerError: false
				}));
			}		
		});
	});
}

logInButton = function (e) {
	e.preventDefault();
	if(!this.state.registering){
		if(this.loginInput.value.length === 0 || this.passwordInput.value.length === 0){
			this.setState(({
				loginError: true
			}));
		} else {
			this.login();
		}
	} else {
		if(this.loginInput.value.length === 0 || this.passwordInput.value.length === 0 || 
			this.firstNameInput.value.length === 0 || this.lastNameInput.value.length === 0){
			this.setState(({
				registerError: true
			}));
	} else {
		this.register();

	}
}
}


render() {
	return (
		<div className="App">


		<div className="FormLayout">

		{
			this.state.invalidLoginError
			?         
			<Alert bsStyle="danger" onDismiss={this.dismissInvalidLoginError}>
			Invalid username and password combination, please try again.
			</Alert>
			: null
		}

		{
			this.state.loginError
			?         
			<Alert bsStyle="danger" onDismiss={this.dismissLoginError}>
			Please enter a username and password.
			</Alert>
			: null
		}

		{
			this.state.usernameExistsError
			?         
			<Alert bsStyle="danger" onDismiss={this.dismissUsernameExistsError}>
			Username already exists, please enter a new username.
			</Alert>
			: null
		}

		{
			this.state.registerError
			?         
			<Alert bsStyle="danger" onDismiss={this.dismissRegisterError}>
			Please fill all required fields.
			</Alert>
			: null
		}

		<div className={"LoginForm" + (this.state.registering ?  "": "-collapse")} >

			<img src={logo} className="logo" alt="huevos_ranchero"/>

			<Form onSubmit={this.logInButton} className="FormLoginField">

			{
				this.state.registering
				? 
				<div className="notFilled1">
				<span className="notFilled">*</span>
				</div>
				: null
			}

			<FormControl className="LoginField"
			placeholder='Username'
			inputRef={input => this.loginInput = input}
			maxLength='16'
			/>

			{
				this.state.registering
				? 
				<div className="notFilled1">
				<span className="notFilled">*</span>
				</div>
				: null
			}
			<FormControl className="LoginField"
			id="formControlsPassword"
			placeholder="Password"
			label="Password"
			type="password"
			maxLength='16'
			inputRef={input => this.passwordInput = input}
			/>

			{
				this.state.registering
				? 
				<div>

				<div className="notFilled1">
				<span className="notFilled">*</span>
				</div>
				<FormControl className="LoginField"
				id="firstName"
				placeholder="First Name"
				maxLength='16'
				inputRef={input => this.firstNameInput = input}
				/>

				<div className="notFilled1">
				<span className="notFilled">*</span>
				</div>
				<FormControl className="LoginField"
				id="lastName"
				placeholder="Last Name"
				maxLength='16'
				inputRef={input => this.lastNameInput = input}
				/>
				</div>
				: null
			}


			<Button type="submit" bsStyle={this.btnStyle} className="LoginField" >{this.btnText}</Button>
			</Form>

			</div>


			<div className="BottomBar">
			{
				this.state.registering
				? 
				<p>Have an account? <button className="btn btn-link" onClick={this.switchLogin}>Log in</button></p>
				: 
				<p>Don't have an account? <button className="btn btn-link" onClick={this.switchLogin}>Sign up</button></p>
			}
			</div>	
			</div>

			</div>
			);
	}
}

const mapStateToProps = store => {
	return {
		isLoggedIn: store.isLoggedIn,
		username: store.username
	}
}

export default connect(mapStateToProps)(App);

