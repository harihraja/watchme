
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import axios from 'axios';

class HelloWorld extends Component {
	constructor() {
		super();
		this.state = { backend: 'Unknown', frontend: 'ReactJS' };
	  }
	  	

	componentDidMount() {
		console.log('componentDidMount');
		fetch('http://localhost:8000/api/info')
		.then((res) => {
			res.json() 
			.then((jsonResult) => {
				console.log(jsonResult);
				var updateState = this.state;
				updateState.backend = jsonResult.backend;
				this.setState(updateState);
			})			
		})
		.catch((err) => {
			console.log(err);
		});
	}

    render() {
    	return (
			<div>
				<Button bsStyle="danger">Danger</Button><br/><br/>
				<Button bsStyle="primary">Primary</Button><br/><br/>
				<Button bsStyle="success">Success</Button><br/><br/>
				<h3>{this.state.backend}</h3>
				<h3>{this.state.frontend}</h3>
			</div>
		);
    }
}
export default HelloWorld;
