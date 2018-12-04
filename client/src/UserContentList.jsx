
import React, { Component } from 'react';
import { Button, Table, Col, Row } from 'react-bootstrap';

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
			<div class="container-fluid">
				<Row className="show-grid">
					<Col sm={12}>
						<h1>WatchList</h1>
						<h4>{this.state.email} : {this.state.language} : {this.state.region} : {this.state.type} </h4>
						<Button type="button" bsStyle="warning" bsSize="large">Refresh</Button><br/>
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
											<label class="bs-switch">
												<input type="checkbox">
													<span class="slider round"></span>
												</input>
											</label>
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
			</div>
		);
    }
}
export default HelloWorld;
