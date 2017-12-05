import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/Members.css';
import './css/VideoPlayback.css';
import { Alert, Form, FormControl, Button, Panel, Table, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import VideoTable from './VideoTable';
import ReactPlayer from 'react-player';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';


const request = require('superagent');
var currentTime = new Date().toString().split(' ').splice(1,4).join(' ');

class VideoPlayback extends Component {
	constructor(props){
		super(props);

		this.state = {
			uploadError: false,
			uploadSuccess: false,
			playing: true,
			volume: 0.8,
			muted: false,
			played: 0,
			duration: 0,
			playbackRate: 1.0,
			loop: false,
			inputValue : 'Only .mp4 files allowed.',
			data: [],
			rows: [],
			fields: ['id', 'name', 'date'],
			showModal: false

			
		}

		this.video = this.video.bind(this);
		this.getVideos = this.getVideos.bind(this);
		this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
	}


	playPause = () => {
		this.setState({ playing: !this.state.playing })
	}
	stop = () => {
		this.setState({ url: null, playing: false })
	}

	onPlay = () => {
		this.setState({ playing: true })
	}
	onPause = () => {
		this.setState({ playing: false })
	}
	toggleLoop = () => {
		this.setState({ loop: !this.state.loop })
	}
	setPlaybackRate = e => {
		this.setState({ playbackRate: parseFloat(e.target.value) })
	}
	onSeekMouseDown = e => {
		this.setState({ seeking: true })
	}
	onSeekChange = e => {
		this.setState({ played: parseFloat(e.target.value) })
	}
	onSeekMouseUp = e => {
		this.setState({ seeking: false })
		this.player.seekTo(parseFloat(e.target.value))
	}
	onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
    	this.setState(state)
    }
}

onClickFullscreen = () => {
	screenfull.request(findDOMNode(this.player))
}
handleAlertDismiss(){
	this.setState({ uploadError: false });
}

componentWillMount(){
	this.getVideo();
		//this.video();
	}

	getVideos(){
		console.log("asdf: " + this);
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
							date: datas[i].date
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

	getVideo(){
		var that = this;
		let video_id = parseInt(this.props.location.search.slice(1).split("=")[1])
		var vid = new Request('http://localhost:3001/api/get-video?video_id=' + video_id, {
			method: 'GET'
		});

		that.state.video_id = video_id;
		that.state.videoUrl = 'http://localhost:3001/api/get-video?video_id=' + video_id;

		fetch(vid)
		.then(function(response){
			if(response.status === 200){
				/*response.json()
				.then(function(datas){
					that.setState({ data: [] });
					for(let i in datas){
						that.state.data.push(
						{
							id : datas[i].id,
							name: datas[i].file_name,
							date: datas[i].date
						});
					}
					//console.log(that.state.data);
					that.video();
				});*/
				//alert("works");
			} else {
				//alert("Error getting user videos");
			}
		});
	}

	video(){
		var that = this;
		let fields = ['id', 'name', 'date'];
		this.setState({ rows: [] });
		this.state.data.forEach(function(data){
			that.state.rows.push(
				<VideoTable key={data.id} 
				tbodyIdKey={data.id} 
				rowData={data} 
				dataOrder={fields} 
				/>);
		});
		this.setState(this.state);
		//console.log(this.state.rows);
	}

	ref = player => {
		this.player = player
	}

	render(){
		const {
			url, playing, volume, muted, loop,
			played, loaded, duration,
			playbackRate,
			soundcloudConfig,
			vimeoConfig,
			youtubeConfig,
			fileConfig
		} = this.state
		const SEPARATOR = ' · '


		return (
			<div>

			<ReactPlayer ref={this.ref} className='react-player' url={this.state.videoUrl} playing 
			playing={playing}
			loop={loop}
			playbackRate={playbackRate}
			volume={volume}
			muted={muted}
			soundcloudConfig={soundcloudConfig}
			vimeoConfig={vimeoConfig}
			youtubeConfig={youtubeConfig}
			fileConfig={fileConfig}
			onReady={() => console.log('onReady')}
			onStart={() => console.log('onStart')}
			onPlay={this.onPlay}
			onPause={this.onPause}
			onBuffer={() => console.log('onBuffer')}
			onSeek={e => console.log('onSeek', e)}
			onEnded={() => this.setState({ playing: loop })}
			onError={e => console.log('onError', e)}
			onProgress={this.onProgress}
			onDuration={duration => this.setState({ duration })}
			/>


			{
				playing
				?
				<button className="pause" onClick={this.playPause}></button>
				: <button className="play" onClick={this.playPause}></button>
			}

			<input className="playback"
			type='range' min={0} max={1} step='any'
			value={played}
			onMouseDown={this.onSeekMouseDown}
			onChange={this.onSeekChange}
			onMouseUp={this.onSeekMouseUp}
			/>

			<button className="fullscreen" onClick={this.onClickFullscreen}></button>

			<br/>
			<br/>
			<br/>
			<b>Playback Speed</b>
			<br/>
			<button onClick={this.setPlaybackRate} value={1}>1</button>
			<button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
			<button onClick={this.setPlaybackRate} value={2}>2</button>

			<br/>
			<label>
			<input type='checkbox' checked={loop} onChange={this.toggleLoop} /> Loop
			</label>

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

export default connect(mapStateToProps)(VideoPlayback);