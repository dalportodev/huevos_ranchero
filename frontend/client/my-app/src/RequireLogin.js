import React, { Component } from 'react';
import {connect} from 'react-redux';

//This function receives the Component that only some user should access
function RequireLogin(ComposedComponent){
  class AuthenticatedComponent extends Component {

    componentWillMount() {
      this.checkAuth();
    }


    checkAuth() {
      if ( ! this.props.isLoggedIn) {

        this.props.history.push('/');
      }
    }

    render() {
      return this.props.isLoggedIn
      ? <ComposedComponent { ...this.props } />
      : null;
    }

  }
  const mapStateToProps = store => {
    return {
      isLoggedIn: store.isLoggedIn,
      username: store.username
    }
  }

  return connect(mapStateToProps)(AuthenticatedComponent);
}

export default RequireLogin;

