import React from 'react';
import Header from './Header';
import Home from './Home';

import './App.css';
import 'react-notifications/lib/notifications.css';
import 'antd/dist/antd.css';

import './test/testData';
import {NotificationContainer} from 'react-notifications';

function App() {
  return (
    <div className="App">
      <Home />
      <NotificationContainer />
    </div>  
  );
}

export default App;
