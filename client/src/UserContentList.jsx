
import React, { Component } from 'react';
import { Table, Col, Row, Grid } from 'react-bootstrap';
import { Button, SplitButton, MenuItem } from 'react-bootstrap';

const queryString = require('query-string');

const SERVER_URL = '/';
// const SERVER_URL = 'http://localhost:8000/';
// const SERVER_URL = 'https://fierce-ravine-70068.herokuapp.com/';

class UserContentList extends Component {
	constructor() {
		super();
		this.state = { 
			email: 'x@y.com', 
			language: 'Hindi', 
			region: 'IN', 
			type: 'Movies', 
			contents: [],
			sorttype: 'release_date',
			sortdir: 'down'
		 };

		this.handleWatchedChange = this.handleWatchedChange.bind(this);
		this.handleLangChange = this.handleLangChange.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleSort = this.handleSort.bind(this);

	}
	
	getContentList(params) {
		if(!params)
			params = {};
		params = { 
			user: params.user ? params.user : this.state.email, 
			language: params.language ? params.language : this.state.language, 
			region: params.region ? params.region : this.state.region, 
			type: params.type ? params.type : this.state.type, 
			sorttype: params.sorttype ? params.sorttype : this.state.sorttype, 
			sortdir: params.sortdir ? params.sortdir : this.state.sortdir, 
		};

		var ajax_url = 'usercontentlist';
		ajax_url = ajax_url+'/'+params.user+'/'+params.language;
		ajax_url = ajax_url+'/'+params.region+'/'+params.type;
		ajax_url = ajax_url+'/'+params.sorttype+'/'+params.sortdir;
		// console.log(ajax_url);

		fetch(SERVER_URL+ajax_url)
		.then((res) => {
			res.json() 
			.then((jsonResult) => {
				console.log(jsonResult);
				var updateState = {};
				updateState.email = jsonResult.userinfo.email;
				updateState.language = jsonResult.contentinfo.language;
				updateState.region = jsonResult.contentinfo.region;
				updateState.type = jsonResult.contentinfo.type;
				updateState.contents = jsonResult.contentlist;
				updateState.sorttype = jsonResult.sortparams.type;
				updateState.sortdir = jsonResult.sortparams.direction;
				this.setState(updateState);
				// console.log(updateState); 
			})			
		})
		.catch((err) => {
			console.log(err);
		});
	}

	updateContentList(params) {
		if(!params)
			params = {};
		params = { 
			user: params.user ? params.user : this.state.email, 
			language: params.language ? params.language : this.state.language, 
			region: params.region ? params.region : this.state.region, 
			type: params.type ? params.type : this.state.type, 
		};

		var ajax_url = 'updatecontentlist';
		ajax_url = ajax_url+'/'+params.user+'/'+params.language;
		ajax_url = ajax_url+'/'+params.region+'/'+params.type;
		fetch(SERVER_URL+ajax_url)
		.then((res) => {
			res.json() 
			.then((jsonResult) => {
				console.log(jsonResult);
				var updateState = {};
				updateState.email = jsonResult.userinfo.email;
				updateState.language = jsonResult.contentinfo.language;
				updateState.region = jsonResult.contentinfo.region;
				updateState.type = jsonResult.contentinfo.type;
				updateState.contents = jsonResult.contentlist;
				updateState.sorttype = jsonResult.sortparams.type;
				updateState.sortdir = jsonResult.sortparams.direction;
				this.setState(updateState);
				// console.log(updateState);
			})			
		})
		.catch((err) => {
			console.log(err);
		});
	}

	componentDidMount() {
		console.log('componentDidMount');
		const parsedQuery = queryString.parse(window.location.search);
		var params = { 
			user: parsedQuery.user, 
			language: parsedQuery.language, 
			region: parsedQuery.region, 
			type: parsedQuery.type,
			sorttype: parsedQuery.sorttype,
			sortdir: parsedQuery.sortdir,
		};
		this.getContentList(params);
	}

	handleUpdate() {
		console.log('handleUpdate');
		// update the state changes
		this.updateContentList();
	}

	handleLangChange(event) {
		var params = {language : event.target.value};
		this.getContentList(params);
	}

	handleSort(event) {
		console.log(event);
		var params = {
			sorttype : event.target.value,
			sortdir : this.state.sortdir=='up' ? 'down' : 'up'
		};
		this.getContentList(params);
	}

	handleWatchedChange(event) {
		// console.log('name: '+event.target.name);
		// console.log('value: '+event.target.value);
		var updateState = this.state;
		var title = event.target.name;
		var action = event.target.value=='No' ? 'watch' : 'watched';
		updateState.contents.forEach(function(item, index) {
			if (item.title == title) {
				item.action = action;
				updateState[index] = item;
				// console.log({title: item.title, action: item.action});
			}
		});

		this.setState(updateState);
		// console.log(updateState);

		var ajax_url = 'usercontentitem' 
			+ '/' + this.state.email 
			+ '/' + this.state.language 
			+ '/' + this.state.region 
			+ '/' + this.state.type 
			+ '/' + title;
		var body = { action: action };
		const formBody = Object.entries(body).map(([key, value]) => 
			encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');
		console.log(body);
		fetch(SERVER_URL+ajax_url, {
			method: 'PUT', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			body: formBody
		})
		.then((res) => {
			res.json() 
			.then((jsonResult) => {
				// console.log(jsonResult);
			})			
		})
		.catch((err) => {
			console.log(err);
		});	
	}

    render() {
    	return (
			<Grid>
				<Row className="show-grid">
					<Col sm={12}>
						<h1>WatchList</h1>
						<h4>{this.state.email} : {this.state.language} : {this.state.region} : {this.state.type} </h4>
					</Col>
				</Row>
				<Row className="show-grid">
					<Col sm={6} smOffset={6}>
						<select value={this.state.language} onChange={this.handleLangChange}>
							<option value="English">English</option>
							<option value="Hindi">Hindi</option>
							<option value="Tamil">Tamil</option>
						</select>
						<Button type="submit" bsStyle="warning" bsSize="xsmall" onClick={this.handleUpdate}>Update</Button><br/>
					</Col>
				</Row>
				<Row className="show-grid">
					<Col sm={12}>
						<Table responsive condensed striped hover>
							<thead>
								<tr>
									<th><Button type="button" as="input" value="title" bsStyle="info" bsSize="xsmall" onClick={this.handleSort}>Title</Button></th>
									<th><Button type="button" as="input" value="rating" bsStyle="info" bsSize="xsmall" onClick={this.handleSort}>Rating</Button></th>
									<th><Button type="button" as="input" value="release_date" bsStyle="info" bsSize="xsmall" onClick={this.handleSort}>Release Date</Button></th>
									<th><Button type="button" as="input" value="action" bsStyle="info" bsSize="xsmall" onClick={this.handleSort}>Watched?</Button></th>
								</tr>
							</thead>
							<tbody>
								{this.state.contents.map((item) => (
									<tr>
										<td>{item.title}</td>
										<td>{item.rating}</td>
										<td>{item.release_date}</td>
										<td> 
											<select name={item.title} value={item.action=='watch' ? 'No' : 'Yes'} onChange={this.handleWatchedChange}>
												<option value="Yes">Yes</option>
												<option value="No">No</option>
											</select>
										</td>
									</tr> 
								))}
							</tbody>
						</Table>
					</Col>
				</Row>

			</Grid>
		);
    }
}
export default UserContentList;
