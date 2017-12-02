import React, { Component } from 'react';

class VideoTable extends Component{
	constructor(props){
		super(props);
		this.createRow = this.createRow.bind(this);
	}

	createRow(tableRowID, data, dataOrder, cells = []){
		for(var i in dataOrder){
			cells.push(<td key={i}>{data[dataOrder[i]]}</td>);
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