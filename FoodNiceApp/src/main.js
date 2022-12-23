import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';

function App(props) {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}

export default App;
