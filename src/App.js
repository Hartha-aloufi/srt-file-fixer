import React from 'react';
import Home from './components/Dashboard/Dashboard';

import 'react-notifications/lib/notifications.css';
import 'antd/dist/antd.css';

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
