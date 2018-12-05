
import React, { Component } from 'react';
import { Table, Col, Row, Grid } from 'react-bootstrap';
import { Button, SplitButton, MenuItem } from 'react-bootstrap';

const queryString = require('query-string');

const SERVER_URL = 'http://localhost:8000';

class UserContentList extends Component {
	constructor() {
		super();
		this.state = { email: 'x@y.com', language: 'English', region: 'US', type: 'Movies', contents: [] };

		this.handleWatchedChange = this.handleWatchedChange.bind(this);
		this.handleLangChange = this.handleLangChange.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}
	
	getContentList(params) {
		if(!params)
			params = {};
		params = { 
			user: params.user ? params.user : this.state.email, 
			language: params.language ? params.language : this.state.language, 
			region: params.region ? params.region : this.state.region, 
			type: params.type ? params.type : this.state.type, 
		};

		var ajax_url = '/usercontentlist';
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
				this.setState(updateState);
				console.log(updateState);
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
			type: parsedQuery.type
		};
		this.getContentList(params);
	}

	handleUpdate() {
		// update the state changes
		this.getContentList();
	}

	handleLangChange(event) {
		var params = {language : event.target.value};
		this.getContentList(params);
	}

	handleWatchedChange(event) {
		// console.log('name: '+event.target.name);
		// console.log('value: '+event.target.value);
		var updateState = this.state;
		updateState.contents.forEach(function(item, index) {
			if (item.title == event.target.name) {
				item.action = event.target.value=='Yes' ? 'watched' : 'watch';
				updateState[index] = item;
				console.log({title: item.title, action: item.action});
			}
		});

		this.setState(updateState);
		// console.log(updateState);
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
						{/* <SplitButton title="Language" id="lang-choice">
							<MenuItem eventKey="1">English</MenuItem>
							<MenuItem eventKey="2">Hindi</MenuItem>
							<MenuItem eventKey="3">Tamil</MenuItem>
						</SplitButton> */}
						<select value={this.state.language} onChange={this.handleLangChange}>
							<option value="English">English</option>
							<option value="Hindi">Hindi</option>
							<option value="Tamil">Tamil</option>
						</select>
						<Button type="button" bsStyle="warning" bsSize="xsmall" onClick={this.handleUpdate}>Update</Button><br/>
					</Col>
				</Row>
				<Row className="show-grid">
					<Col sm={12}>
						<Table responsive condensed striped hover>
							<thead>
								<tr>
									<th>Title</th>
									<th>Rating</th>
									<th>Release Date</th>
									<th>Watched?</th>
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
											{/* <label class="bs-switch">
												<input type="checkbox">
													<span class="slider round"></span>
												</input>
											</label> */}
											{/* <input type="checkbox"> </input> */}
											{/* <div class="btn-group btn-group-toggle" data-toggle="buttons">
												<label class="btn btn-secondary active">
													<input type="radio" name="options" id="option1" autocomplete="off" checked> No </input> 
												</label>
												<label class="btn btn-secondary">
													<input type="radio" name="options" id="option2" autocomplete="off"> Yes </input> 
												</label>
											</div> */}
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
