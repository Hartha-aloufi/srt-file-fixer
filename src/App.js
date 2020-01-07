import React from 'react';
import Header from './Header';
import Home from './Home';

import './App.css';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <NotificationContainer />
    </div>  
  );
}

export default App;
