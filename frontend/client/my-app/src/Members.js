import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/Members.css';
import { Alert, Form, FormControl, Button, Panel, Table, Grid, Row, Col,
	Popover, Modal, OverlayTrigger} from 'react-bootstrap';
	import { connect } from 'react-redux';
	import VideoTable from './VideoTable';

	const request = require('superagent');
	var currentTime = new Date().toString().split(' ').splice(1,4).join(' ');

	class Members extends Component {
		constructor(props){
			super(props);

			this.state = {
				uploadError: false,
				uploadSuccess: false,
				inputValue : 'Only .mp4 files allowed.',
				data: [],
				rows: [],
				showModal: false,
				link: '',
				modalTitle: ''
			}

			this.video = this.video.bind(this);
			this.getVideos = this.getVideos.bind(this);
			this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
			this.dismissUploadSuccess = this.dismissUploadSuccess.bind(this);
			this.openVideo = this.openVideo.bind(this);
			this.setModalTitle = this.setModalTitle.bind(this);
		}

		openVideo(id, name){
			let url = "video?video=" + id;
			this.setState({ 
				showModal: true,
				link: url,
				modalTitle: 'ID#' + id + ' - ' + name });
		}

		closeVideo(){
			this.setState({showModal: false});
		}

		setModalTitle(title){
			this.setState({modalTitle:title});
		}

		handleAlertDismiss(){
			this.setState({ uploadError: false });
		}

		dismissUploadSuccess(){
			this.setState({ uploadSuccess: false });
		}

		componentWillMount(){
			this.getVideos();
		}

		componentDidMount(){
			this.fileName.value = '';
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
						that.setState({ data: [] });
						for(let i in datas){
							that.state.data.push(
							{
								id : datas[i].id,
								name: datas[i].file_name,
								date: datas[i].date,
								status: datas[i].status
							});
						}
					//console.log(that.state.data);
					that.video();
				});
				//alert("works");
			} else {
				//alert("Error getting user videos");
			}
		});
		}

		video(){
			var that = this;
			let fields = ['id', 'name', 'date', 'status'];
			this.setState({ rows: [] });
			this.state.data.forEach(function(data){
				that.state.rows.push(
					<VideoTable key={data.id} 
					tbodyIdKey={data.id} 
					rowData={data} 
					dataOrder={fields} 
					openVideo={that.openVideo}
					setModalTitle={that.setModalTitle}
					/>);
			});
			this.setState(this.state);
		//console.log(this.state.rows);
	}

	logout(){
		
		this.props.dispatch({type: 'LOG_OUT'});
		this.props.history.push("/");
		
	}

	browse(){
		if(typeof this.fileName.files[0] !== 'undefined'){
			var ext = this.fileName.files[0].name.match(/\.(.+)$/)[1];
			//console.log(ext);

			if(ext === 'mp4'){
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
		e.preventDefault();
		var that = this;
		console.log(this.fileName.files[0]);
		if(typeof this.fileName.files[0] !== 'undefined'){
			request
			.post('http://localhost:3001/api/upload')
			.attach('videoFile', this.fileName.files[0])
			.field('username', this.props.username)
			.end(function(err, res){
				if(err){
					that.setState({ uploadError: true });
					return;
				} else {
					that.getVideos();
					that.setState({
						inputValue: 'Only .mp4 files allowed.',
						uploadSuccess: true,
						uploadError: false
					});
					that.fileName.value = '';
					//console.log(that.fileName.files[0]);
				}

			});
		} else {
			this.setState({ uploadError: true, uploadSuccess: false });
		}

	}

	render(){
		const popover = (
			<Popover id="modal-popover" title="popover">
			popover test
			</Popover>
			);

		var Iframe = React.createClass({     
			render: function() {
				return(         
					<div>          
					<iframe src={this.props.src} height={this.props.height} width={this.props.width} scrolling="no" frameBorder="0" />         
					</div>
					)
			}
		});

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

			{
				this.state.uploadSuccess
				?         
				<Alert bsStyle="success" className="center" onDismiss={this.dismissUploadSuccess}>
				File uploaded successfully!
				</Alert>
				: null
			}

			{
				this.state.uploadError
				?         
				<Alert bsStyle="danger" className="center" onDismiss={this.handleAlertDismiss}>
				Please select a .mp4 file.
				</Alert>
				: null
			}

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

			<Modal bsSize="large" show={this.state.showModal} onHide={this.closeVideo.bind(this)}>
			<Modal.Header closeButton>
			<Modal.Title>{this.state.modalTitle}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Iframe src={this.state.link} height="500" width="640" />
			</Modal.Body>
			<Modal.Footer>
			<Button onClick={this.closeVideo.bind(this)}>Close</Button>
			</Modal.Footer>
			</Modal>



			<Table bordered condensed hover>
			<thead>
			<tr>
			<th>ID#</th>
			<th>Name</th>
			<th>Date</th>
			<th>Status</th>
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
