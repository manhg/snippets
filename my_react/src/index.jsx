import React from 'react';
import {render} from 'react-dom';

import MyWidget from './MyWidget.coffee';

class App extends React.Component {
  render () {
    return <MyWidget name="React" />;
  }
}

render(<App/>, document.getElementById('react-app'));
