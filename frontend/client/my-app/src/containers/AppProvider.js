import PropTypes from 'prop-types'; 
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

class AppProvider extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        children: PropTypes.node
    }

    constructor(props) {
        super(props);

        this.state = { rehydrated: false };
    }

    componentWillMount() {
        const opts = {
            whitelist: ['username', 'isLoggedIn'] // <-- Your auth/user reducer storing the cookie
        };

        persistStore(this.props.store, opts, () => {
            this.setState({ rehydrated: true });
        });
    }

    render() {
        if (!this.state.rehydrated) {
            return null;
        }

        return (
            <Provider store={this.props.store}>
                {this.props.children}
            </Provider>
        );
    }
}

AppProvider.propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node
}

export default AppProvider;
