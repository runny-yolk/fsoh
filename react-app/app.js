const React = require('react');
const ReactDOM = require('react-dom');
const Tweets = require('./tweets.js');
const Button = require('./components.js').Button;
const Reviews = require('./components.js').Reviews;


class Page extends React.Component {
    constructor(props) {
        super(props);
        this.getTweets = this.getTweets.bind(this);
        this.state = {
            tweets:[],
            status:'ready'
        }
    }

    getTweets() {
        // Differentiating between loading from the homepage and any subsequent load
        // This is so that the messages that appear in the Reviews component stay consistent between ready/loading screens
        if (this.state.status == 'ready'){
            this.setState({status:'loading', tweets:[]})
        } else {
            this.setState({status:'loading again', tweets:[]})
        }
        // this refers to the HTTP response within the request callback, so I put the page class into a different variable
        var page = this;
        var req = new XMLHttpRequest();
        req.addEventListener("load", function() {
            // If there's an error at the back end
            if(this.responseText.substr(0,5) == "Error"){
                page.setState({status:'error'})
                return
            }
            var tweets = JSON.parse(this.responseText);
            page.setState({tweets:tweets, status:'loaded'});
        });
        req.addEventListener("timeout", function(){
            page.setState({status:'error'})
        });
        req.addEventListener("error", function(){
            page.setState({status:'error'})
        });
        req.timeout = 11000;
        req.open("GET", "/api");
        req.send();
    }

    render() {
        // Parses getTweets() down to the button, so the button can be used as a button
        // Renders reviews on any page where there isn't tweets
        // Doesn't render tweets/filters if there are no tweets
        return (
            <div>
                <Button getTweets={this.getTweets} status={this.state.status}/>
                {(this.state.status != 'loaded') ? <Reviews status={this.state.status}/>:null}
                {(this.state.tweets.length != 0) ? <Tweets tweets={this.state.tweets}/>:null}
            </div>
        )
    }
}

ReactDOM.render(
    <Page/>,
    document.getElementById('root')
);