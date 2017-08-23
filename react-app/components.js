const React = require('react');
const ReactDOM = require('react-dom');

// I created a seperate file for miscellanous components that don't quite justify individual files, but don't fit in app or tweets

module.exports.Button = class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingText: 'Loading...',
            clickStep: 0
        };
        this.changeText = this.changeText.bind(this)
    }

    changeText(){
        // Messages that get shown if you press the loading button multiple times
        var clickStep = this.state.clickStep;
        var messages = [
            'Oi, stop that.',
            'I\'ll have you if you do that again.',
            'Stop clicking me! It\'s loading! Just chill!',
            'How many times are you really going to click?',
            'You only have 5 seconds',
            'You won\'t get through all of the messages',
            'Not that there\'s an infinite number of them..',
            'OR IS THERE?',
            'No, no, there isn\'t, this is the last one.',
            'OR IS IT?',
            'Okay, this is the actual last one. Bye.'
        ];
        if(clickStep >= messages.length) clickStep = (messages.length -2);

        this.state.clickStep++;
        this.setState({loadingText:messages[clickStep]});
    }

    render(){
        
        // Different buttons for different loading statuses
        // Originally this just changed a string, but I wanted to use span and br within the button div
        if (this.props.status == 'ready') {
            var btn = (<div id="button" onClick={this.props.getTweets}><span style={{fontFamily: "'EB Garamond', serif"}}>ENTER HELL</span> (start)</div>)
        }
        if (this.props.status == 'loading' || this.props.status == 'loading again') {
            var btn = (<div id="button" className="animated flash infinite" onClick={this.changeText}>{this.state.loadingText}</div>)
        }
        if (this.props.status == 'loaded') {
            this.state.clickStep = 0;
            this.state.loadingText = 'Loading...';
            var btn = (<div id="button" onClick={this.props.getTweets}>Press me for new tweets.<br/><span style={{fontFamily: "'EB Garamond', serif", fontStyle: "italic"}}>Scroll down, if you dare..</span></div>)
        }
        if (this.props.status == 'error') {
            var btn = (<div id="button" onClick={this.props.getTweets}>Oops! Problems.<br/>Try again?</div>)
        }

        return(
            <div id="buttonwrap">
                {btn}
                <div id="buttonbar"></div>
            </div>
        )
    }
}


module.exports.Reviews = class Reviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            i : 0,
            messages : [
                'fsoh: A bad replacement for good drugs.',
                'Why have kids, when this site could drive you to alcoholism and divorce instead?',
                'fsoh: A tricky wank, but not impossible.',
                '9 out of 10 doctors reccomend using this site to increase pain.',
                'fsoh: A Surprising Amount Of Porn',
                'fsoh is an FDA approved replacement for chronic depression.',
                'fsoh: The most magical place on Earth! Except Disneyworld, obviously.',
                'fsoh: All of humanity\'s problems, in one fun-sized package!',
                'fsoh: Twitter Rant GONE SEXUAL!?!?',
                'fsoh: it\'s really just a YouTube prank',
                'If you feel like you wasted time here, just imagine the guy who made "here"',
            ]
        };
    }

    componentDidMount() {
        this.state.intervals = setInterval(function(data){
            data.forceUpdate();
        }, 4500, this)
    }

    componentWillUnmount() {
        clearInterval(this.state.intervals);
    }

    render(){

        // Unless the user is on the homepage or loading for the first time, I want the message to be random
        // Otherwise it follows a predefined order that prefers ones I like more, to ensure users see the better ones
        if (this.props.status != 'ready' || this.props.status != 'loading') {
            var message = this.state.messages[Math.floor(Math.random()*this.state.messages.length)];
        } else {
            if (this.state.i == this.state.messages.length) this.state.i = 0;

            var message = this.state.messages[this.state.i];
            this.state.i++
        }

        return (
            <div id="messagebox">{message}</div>
        )
    }
}


// Filters were fine being in the tweets.js file, but then they got more complicated when I had to account for mobile
module.exports.Filters = class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boxStyle : {width:0},
            overlayStyle : {display:'none'}
        }
        this.showFilters = this.showFilters.bind(this);
    }

    showFilters() {
        // Shows or hides the filterbox depending on whether it's shown or hidden already
        // This function only exists within the page on the mobile version of the site
        // Could've added a new variable to check this, but considering this metric already existed..
        if(document.getElementById('filterbox').offsetWidth == 0){
            this.setState({boxStyle : {
                width : window.innerWidth/1.4
            }, overlayStyle : {
                display:'block'
            }})
        } else {
            this.setState({boxStyle : {
                width : 0
            }, overlayStyle : {
                display:'none'
            }})
        }
    }

    render() {
        if(window.innerWidth < 900){
            return (
                <div>
                    <div id="info">
                        Press the menu button in the top-left for filters!
                    </div>

                    <div id="overlay" style={this.state.overlayStyle} onClick={this.showFilters}></div>
                    <div id="menu" onClick={this.showFilters}>
                        <hr style={{margin:"14px 0"}}/>
                        <hr style={{margin:"18px 0"}}/>
                        <hr style={{margin:"14px 0"}}/>
                    </div>
                    <div id="filterbox" style={this.state.boxStyle}>
                        <div id="menuhead">Filters</div>

                        <h4>Language</h4>
                        <div className="filters" id="langfilters">
                            {this.props.langs}
                        </div>

                        <h4>Milliseconds containing 7+ Tweets</h4>
                        <div className="filters" id="timefilters">
                            {(this.props.time.length != 0)? this.props.time:<div id="info">No filters available here.</div>}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div id="filterbox">

                <h3>Filter by language</h3>
                <div className="filters" id="langfilters">
                    {this.props.langs}
                </div>

                <h3>Milliseconds containing 7+ Tweets</h3>
                <div className="filters" id="timefilters">
                    {(this.props.time.length != 0)? this.props.time:<div id="info">No filters available here.</div>}
                </div>

            </div>
        )
    }
}