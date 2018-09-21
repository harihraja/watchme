
import React from 'react';
import { Button } from 'react-bootstrap';

class HelloWorld extends React.Component {
    render() {
    	return <div>
    		<Button bsStyle="danger">Danger</Button><br/><br/>
    		<Button bsStyle="primary">Primary</Button><br/><br/>
    		<Button bsStyle="success">Success</Button>
    	</div>
    }
}
export default HelloWorld;
