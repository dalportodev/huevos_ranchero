import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/Members.css';
import { Alert, Form, FormControl, Button, Panel, Table, Grid, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
const request = require('superagent');

class Members extends Component {
	constructor(props){
		super(props);

		this.state = {
			inputValue : 'Only .mp4 files allowed.'
		}
	}

	logout(){
		this.props.dispatch({type: 'LOG_OUT'});
		this.props.history.push("/");
	}

	browse(){
		if(typeof this.fileName.files[0] !== 'undefined'){
			var ext = this.fileName.files[0].name.match(/\.(.+)$/)[1];
			console.log(ext);

			if(ext == 'mp4'){
				this.setState({
					inputValue: this.fileName.files[0].name
				});
			} else {
				this.fileName.value = '';
				alert('Please choose a file with the .mp4 extension');
			}
		} else {
			this.setState({
				inputValue: 'Only .mp4 files allowed.'
			});
		}

	}

	handleSubmit(event) {
		alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
	}

	upload = e => {
		console.log(this.fileName.files[0]);
		e.preventDefault();

		request
		.post('http://localhost:3001/api/upload')
		.attach('videoFile', this.fileName.files[0])
		.field('username', this.props.username)
		.end(function(err, res){
			if(err){
				alert(err);
				return;
			}
			alert("File uploaded successfully!");
		});

		//var newform = new FormData(document.getElementById("formUpload"));

/*
		fetch('http://localhost:3001/api/upload', {
			method: 'POST',
			body: newform
		});
		*/
		
	}

	render(){
		return (
			<div>
			<div className="headingBlock">
			<div className="logoutDiv">
			<Button bsStyle="danger" className="logout" onClick={this.logout.bind(this)}>Sign out</Button>
			</div>
			<img src={logo} className="logo" alt="huevos_ranchero"/>
			<h3 className="center">Welcome {this.props.username}!</h3>
			</div>
			<Panel className="panel innerBlock" bsStyle="primary" header={
				<div>
				<h4>Videos</h4>
				</div>
			}>

			
			<Form onSubmit={this.upload.bind(this)} encType='multipart/form-data' ref='uploadForm' id='uploadForm' method='POST' action='http://localhost:3001/api/upload'>
			<input type="hidden" name="username" value={this.props.username} />


			<div className="uploadBlock">
			<div className="input-group">
			<label className="input-group-btn">
			<span className="btn btn-primary">
			Browse... 
			<FormControl 
			name="videoFile"
			inputRef={input => this.fileName = input} 
			type="file"
			accept="video/mp4"
			onChange={this.browse.bind(this)} 
			style={displayNone}/>
			</span>
			</label>
			<input type="text" className="form-control" value={this.state.inputValue} disabled />
			</div>
			</div>

			<Button className="upload" bsStyle="primary" type="submit">Upload video</Button>
			</Form>

			
			<br/>
			<br/>
			<br/>
			<Table bordered condensed hover>
			<thead>
			<tr>
			<th>#</th>
			<th>Name</th>
			<th>Date</th>
			</tr>
			</thead>
			<tbody>
			<tr>
			<td>1</td>
			<td>Video 1</td>
			<td>test</td>
			</tr>
			<tr>
			<td>2</td>
			<td>Video 2</td>
			<td>test2</td>
			</tr>
			<tr>
			<td>3</td>
			<td>Video 3</td>
			<td>test3</td>
			</tr>
			</tbody>
			</Table>


			</Panel>
			</div>
			);
	}
}

const displayNone = {
	display: 'none'
};

const mapStateToProps = store => {
	return {
		isLoggedIn: store.isLoggedIn,
		username: store.username
	}
}

export default connect(mapStateToProps)(Members);