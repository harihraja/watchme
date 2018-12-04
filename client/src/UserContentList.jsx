
import React, { Component } from 'react';
import { Button, Table, Col, Row } from 'react-bootstrap';

const queryString = require('query-string');

const SERVER_URL = 'http://localhost:8000';

class UserContentList extends Component {
	constructor() {
		super();
		this.state = { email: 'x@y.com', language: 'English', region: 'US', type: 'Movies', contents: [] };

		this.handleLangChange = this.handleLangChange.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
	}
	
	update(params) {
		if(!params)
			params = {};
		if(!params.user)
			params.user = this.state.email;
		if(!params.language)
			params.language = this.state.language;
		if(!params.region)
			params.region = this.state.region;
		if(!params.type)
			params.type = this.state.type;

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
		var params = {}
		params['user'] = parsedQuery.user;
		params['language'] = parsedQuery.language;
		params['region'] = parsedQuery.region;
		params['type'] = parsedQuery.type;
		this.update(params);
	}

	handleRefresh() {
		this.update();
	}

	handleLangChange(event) {
		var params = {language : event.target.value};
		this.update(params);
	}

    render() {
    	return (
			<div class="container">
				<Row>
					<Col sm={12}>
						<h1>WatchList</h1>
						<h4>{this.state.email} : {this.state.language} : {this.state.region} : {this.state.type} </h4>
					</Col>
				</Row>
				
				<Row>
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
											<select value={item.action=='watch' ? 'No' : 'Yes'} onChange={this.handleWatchedChange}>
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
				<Row>
					<Col sm={6} smOffset={6}>
						<select value={this.state.language} onChange={this.handleLangChange}>
							<option value="English">English</option>
							<option value="Hindi">Hindi</option>
							<option value="Tamil">Tamil</option>
						</select>
						{/* <Button type="button" bsStyle="warning" bsSize="xsmall" onClick={this.handleRefresh}>Refresh</Button><br/> */}
					</Col>
				</Row>
			</div>
		);
    }
}
export default UserContentList;
