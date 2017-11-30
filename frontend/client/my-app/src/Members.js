import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/Members.css';
import { Alert, Form, FormControl, Button, Panel, Table, Grid, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import VideoTable from './VideoTable';

const request = require('superagent');
var currentTime = new Date().toString().split(' ').splice(1,4).join(' ');

class Members extends Component {
	constructor(props){
		super(props);

		this.state = {
			inputValue : 'Only .mp4 files allowed.',
			data: [
			/*{
				id: 100,
				name: "test",
				date: currentTime
			}, {
				id: 200,
				name: "test2",
				date: currentTime
			}, {
				id: 300,
				name: "test3",
				date: currentTime
			}*/
			],
			rows: [],
			fields: ['id', 'name', 'date']
		}

		this.video = this.video.bind(this);
		this.getVideos = this.getVideos.bind(this);
	}

	componentWillMount(){
		this.getVideos();
		//this.video();
	}

	getVideos(){
		var that = this;
		var getvids = new Request('http://localhost:3001/api/get-videos?username=' + this.props.username, {
			method: 'GET'
		});

		fetch(getvids)
		.then(function(response){
			if(response.status === 200){
				response.json()
				.then(function(datas){
					for(const i in datas){
						that.state.data.push(
						{
							id : datas[i].id,
							name: datas[i].file_name,
							date: datas[i].date
						});
					}
					console.log(that.state.data);
					that.video();
				});
				//alert("works");
			} else {
				//alert("Error getting user videos");
			}
		});
	}

	video(){
		//console.log("HEYY");
		var that = this;
		let fields = ['id', 'name', 'date'];
		this.state.rows = [];
		this.state.data.forEach(function(data){
			that.state.rows.push(
				<VideoTable key={data.id} 
				tbodyIdKey={data.id} 
				rowData={data} 
				dataOrder={fields} 
				/>);
		});
		this.setState(this.state);
		console.log(this.state.rows);
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

	upload = e => {
		var that = this;
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
	that.getVideos();
	alert("File uploaded successfully!");
});

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
		<th>ID#</th>
		<th>Name</th>
		<th>Date</th>
		</tr>
		</thead>

		<tbody>
		{this.state.rows}
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