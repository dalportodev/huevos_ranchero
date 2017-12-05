import React, { Component } from 'react';
import logo from './huevosranchero.png';
import './css/Members.css';
import './css/VideoPlayback.css';
import { Alert, Form, FormControl, Button, Panel, Table, Grid, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import VideoTable from './VideoTable';
import ReactPlayer from 'react-player'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'

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
			fields: ['id', 'name', 'date']
		
			
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

	componentDidMount(){
		this.fileName.value = '';
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
				<Alert bsStyle="success" className="center" onDismiss={this.handleAlertDismiss}>
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
			{this.state.video_id}
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

			<th>Controls</th> <br/>

<td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                <th>Playback Speed</th> <br/>
                <button onClick={this.setPlaybackRate} value={.2}>.2</button>
                <button onClick={this.setPlaybackRate} value={.5}>.5</button>
                <button onClick={this.setPlaybackRate} value={1}>1</button>
                <button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
                <button onClick={this.setPlaybackRate} value={2}>2</button>
              </td>

<br/>
               <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
              <br/>
              <td>
                <label>
                  <input type='checkbox' checked={loop} onChange={this.toggleLoop} /> Loop
                </label>
              </td>
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

export default connect(mapStateToProps)(VideoPlayback);