/** @jsx React.DOM */

/**
 *  Properties:
 *      author - user who created the squeak
 *      content - text of the squeak
 */
var Squeak = React.createClass({
    render: function() {
        return (
            <div className="squeak">
                <h3 className="squeak-author">{this.props.author}</h3>
                <span className="squeak-content">{this.props.content}</span>
            </div>
        );
    }
});

/**
 *  Properties:
 *      squeakData - raw data from the server
 */
var SqueakList = React.createClass({
    render: function() {
        var squeakNodes = this.props.squeakData.map(function(squeak) {
            return (
                <Squeak author={squeak.author} content={squeak.content} key={squeak.key} />
            );
        });
        return (
            <div className="squeak-list">
                {squeakNodes}
            </div>
        );
    }
});

var SqueakForm = React.createClass({
    handleSubmit: function() {
        var content = this.refs.content.getDOMNode().value.trim();
        this.props.onSqueakSubmit({content: content});
        this.refs.content.getDOMNode().value = '';
        return false;
    },
    render: function() {
        return (
            <form className="squeak-form" onSubmit={this.handleSubmit}>
                <textarea placeholder="Squeak about something..." ref="content"></textarea>
                <button type="submit">Squeak it!</button>
            </form>
        );
    }
});

/**
 * Properties
 *      onSignIn - callback to handle form submission
 */
var SqueakSignInForm = React.createClass({
    handleSubmit: function() {
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim();
        this.props.onSignIn(username, password);
        this.refs.username.getDOMNode().value = '';
        this.refs.password.getDOMNode().value = '';
        return false
    },
    render: function() {
        return (
            <div className="squeak-sign-in">
                <form className="squeak-form" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Username" ref="username" />
                    <input type="password" placeholder="Password" ref="password" />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        );
    }
});

/* Properties:
 *
 */
var SqueakSignOutForm = React.createClass({
    handleSubmit: function() {
        this.props.onSignOut();
        return false;
    },
    render: function() {
        return (
            <form className="squeak-form" onSubmit={this.handleSubmit}>
                <button type="submit">Sign Out</button>
            </form>
        );
    }
});

/**
 * Properties:
 *      pollingInterval - number of ms between server checks
 * State
 *      squeaks - list of squeak data structures
 *      username - name of the signed-in user
 */
var SqueakApp = React.createClass({
    
    // Server communication

    loadSqueaksFromServer: function() {
        // TODO Fetch data from the server (stub for now) - data query would be parameterized with username
        if (this.state.username === 'glesica') {
            this.setState({squeaks: [
                {author: 'pkujawa', content: 'I have a keyboard shortcut to get back to work :-)', key: 'squeak3'},
                {author: 'tmccall', content: 'Get back to work, George!', key: 'squeak2'},
                {author: 'lfisher', content: 'Who set off the alarm?!', key: 'squeak4'},
                {author: 'glesica', content: 'Posting my first squeak', key: 'squeak1'}
            ]});
        } else if (this.state.username === 'tmccall') {
            this.setState({squeaks: [
                {author: 'tmccall', content: 'Get back to work, George!', key: 'squeak2'},
                {author: 'lfisher', content: 'Who set off the alarm?!', key: 'squeak4'},
                {author: 'glesica', content: 'Posting my first squeak', key: 'squeak1'}
            ]});
        }
    },
    sendSqueakToServer: function(squeak) {
        // Optimistically add the squeak
        var squeaks = this.state.squeaks;
        squeaks.unshift({
            author: this.state.username,
            content: squeak.content,
            // TODO Not sure if this is the "right" way to do it, item will need to be replaced anyway
            key: 'newitem' + Date.now()
        });
        this.setState({squeaks: squeaks}, function() {
            // TODO Send the squeak to the server
        });
    },

    // User management

    authenticateUser: function(username, password) {
        // TODO Actually check something, stub for now
        if ((username === 'glesica' && password === 'password') ||
             (username === 'tmccall' && password === 'password')) {
            this.signUserIn(username);
        }
    },
    signUserIn: function(username) {
        this.setState({username: username}, this.loadSqueaksFromServer);
    },
    signUserOut: function() {
        this.setState({username: ''});
    },

    // Built-in callbacks

    getInitialState: function() {
        return {
            squeaks: [],
            username: ''
        };
    },
    componentWillMount: function() {
        this.loadSqueaksFromServer();
        //setInterval(this.loadSqueaksFromServer, this.props.pollingInterval);
    },
    render: function() {
        if (!!this.state.username) {
            return (
                <div className="squeak-app">
                    <div className="squeak-interface">
                        <SqueakForm onSqueakSubmit={this.sendSqueakToServer} />
                        <SqueakSignOutForm onSignOut={this.signUserOut} />
                    </div>
                    <SqueakList squeakData={this.state.squeaks} />
                </div>
            );
        } else {
            return (
                <div className="squeak-app">
                    <SqueakSignInForm onSignIn={this.authenticateUser} />
                </div>
            );
        }
    }
});

React.renderComponent(
    <SqueakApp pollingInterval={10000} />,
    document.getElementById('app')
);
