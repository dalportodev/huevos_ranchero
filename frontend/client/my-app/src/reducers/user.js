// src/reducers/counterReducer.js

const initialState = {
  isLoggedIn: false,
  username: null
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGGED_IN_TRUE':
    const nextState = {
      ...state,
      isLoggedIn: true
    };
    return nextState
    case 'LOG_OUT':
    const nextState2 = {
      ...state,
      isLoggedIn: false,
      username: ''
    };
    return nextState2
    case 'GET_USERNAME':
    const nextState3 = {
      ...state,
      username: action.username
    };
    return nextState3
    default:
    return state
  }
}

export default rootReducer