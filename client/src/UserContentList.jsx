
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

const queryString = require('query-string');

const SERVER_URL = 'http://localhost:8000';

class HelloWorld extends Component {
	constructor() {
		super();
		this.state = { email: 'x@y.com', language: 'English', region: 'US', type: 'Movies', contents: [] };
	  }
	  	

	componentDidMount() {
		console.log('componentDidMount');
		const parsedQuery = queryString.parse(window.location.search);
		var ajax_url = '/usercontentlist';
		ajax_url = ajax_url+'/'+parsedQuery.user+'/'+parsedQuery.language;
		ajax_url = ajax_url+'/'+parsedQuery.region+'/'+parsedQuery.type;
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

    render() {
    	return (
			// <div>
			// 	<h2>{this.state.email}</h2>
			// 	<h3>{this.state.language} : {this.state.region} : {this.state.type}</h3>
			// 	<ul class="list-group">
			// 		{this.state.contents.map((item) => (
			// 			<li class="list-group-item list-group-item-info">{item.title}</li> 
			// 		))}
			// 	</ul>
			// </div>
			<div class="container">
				<h2>User Content List</h2>
				<div class="row">
					<div class="col-xs-12">
						<div class="table-responsive">
							<table class="table table-bordered table-hover">
								<caption class="text-center">{this.state.email} : {this.state.language} : {this.state.region} : {this.state.type} </caption>
								<thead>
									<tr>
										<th>Title</th>
										<th>Rating</th>
										<th>Release Date</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{this.state.contents.map((item) => (
										<tr>
											<td>{item.title}</td>
											<td>{item.rating}</td>
											<td>{item.release_date}</td>
											<td>{item.action}</td>
										</tr> 
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
    }
}
export default HelloWorld;
