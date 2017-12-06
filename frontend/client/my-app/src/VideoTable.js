import React, { Component } from 'react';

class VideoTable extends Component{
	constructor(props){
		super(props);
		this.createRow = this.createRow.bind(this);
	}

	createIframe(){
		return(         
			<div>          
			<iframe src={this.props.src} height={this.props.height} width={this.props.width} scrolling="no" frameBorder="0" />         
			</div>
			);
	}

	createRow(tableRowID, data, dataOrder, cells = []){
		let id = 0;
		for(var i in dataOrder){
			if (i === "0") {
				let url = "video?video=" + data[dataOrder[i]];
				id = data[dataOrder[i]];
				let name = data.name;
				console.log(name);
				cells.push(<td key={i}><a href="#" onClick={() => {this.props.openVideo(id, name); return false;}}>{data[dataOrder[i]]}</a></td>);
			} else if(i === "3") {
				if(data[dataOrder[i]] == "Done"){
					cells.push(<td key={i}><font color="green">{data[dataOrder[i]]}</font></td>);
				} else if(data[dataOrder[i]] == "Error"){
					cells.push(<td key={i}><font color="red">{data[dataOrder[i]]}</font></td>);
				} else {
					cells.push(<td key={i}>{data[dataOrder[i]]}</td>);
				}
			} else {
				cells.push(<td key={i}>{data[dataOrder[i]]}</td>);
			}
			
		}

		return(<tr key={i}>{cells}</tr>);
	}

	render(){

		return this.createRow(
			this.props.tbodyIdKey,
			this.props.rowData,
			this.props.dataOrder
			);
	}
}

export default VideoTable;