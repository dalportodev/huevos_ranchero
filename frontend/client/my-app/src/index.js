import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose } from 'redux';
import {createLogger} from 'redux-logger';
import {autoRehydrate} from 'redux-persist';
//import store from './containers/store';

import './css/index.css';
import App from './App';
import Members from './Members';
import VideoPlayback from './VideoPlayback';
import RequireLogin from './RequireLogin';
import reducer from './reducers/user'

import { spring, AnimatedSwitch } from 'react-router-transition';
import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter } from 'react-router-dom';
import AppProvider from './containers/AppProvider';

const middlewares =[];
//dev logging
middlewares.push(createLogger());

const store = createStore(
	reducer,
	undefined,
	compose(applyMiddleware(...middlewares), autoRehydrate()));


// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 500,
    damping: 64,
  });
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

ReactDOM.render(

	<AppProvider store={store}>

	<BrowserRouter>
	<div>
	<AnimatedSwitch
    atEnter={bounceTransition.atEnter}
    atLeave={bounceTransition.atLeave}
    atActive={bounceTransition.atActive}
    mapStyles={mapStyles}
    className="switch-wrapper"
  >
	<Route exact path="/" component={App} />
	<Route path="/members" component={RequireLogin(Members)} />
  <Route path="/video" component={RequireLogin(VideoPlayback)} />
	</AnimatedSwitch>
	</div>
	</BrowserRouter>
	</AppProvider>

	, document.getElementById('root'));
registerServiceWorker();
