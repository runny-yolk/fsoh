const React = require('react');
const ReactDOM = require('react-dom');
const Filters = require('./components.js').Filters;
const namefind = require('./namefind.js');
const linkParse = require('./linkParse.js');

// I decided to keep the tweets component in a seperate module

module.exports = class Tweets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            langs: [],
            langFilter: [],
            times:[],
            timeFilter: [],
        };
        this.defaultProps = {
            tweets : []
        }
        this.filterLang = this.filterLang.bind(this);
        this.filterTime = this.filterTime.bind(this);
    }


    componentWillReceiveProps(nextProps){
        // Recalculates filters based on the new tweets
        // Also only does this if the new tweets are new, and exist
        // Filters wouldn't be remembered if it ran this while there were no tweets
        if (nextProps.tweets != this.props.tweets && nextProps.tweets.length != 0) {
            this.state.timeFilter = [];

            var langs = [];

            for (var i = 0; i < nextProps.tweets.length; i++) {
            // Adds new language to be used to define the filters, if the language isn't already in the array 
                if (!langs.includes(nextProps.tweets[i].lang)){
                    langs.push(nextProps.tweets[i].lang);
                }
            }
            
            langs.sort();

            // The new language filter keeps a filter turned on if the corresponding language is in the new tweets
            // If you just kept all the filters on, you could easily end up with a filter on that you can't turn off
            // Since only filters with 1 or more tweets are shown
            var newLangFilter = this.state.langFilter.filter(function(i){
                return (langs.includes(i));
            })

            this.state.langs = langs;
            this.state.langFilter = newLangFilter;


            // Creates an object with two arrays running in parrallel, times, and the number of tweets that occur at that millisecond
            // More or less a table
            var timeTable = {times:[], frequency:[]};
            for (var i = 0; i < nextProps.tweets.length; i++) {
                if (!timeTable.times.includes(nextProps.tweets[i].timestamp_ms)){
                    timeTable.times.push(nextProps.tweets[i].timestamp_ms);
                    timeTable.frequency.push(0);
                } else {
                    var ind = timeTable.times.indexOf(nextProps.tweets[i].timestamp_ms);
                    timeTable.frequency[ind] += 1;
                }
            }

            // Records the times if they have 7+ tweets
            var newTimes = [];
            for (var i = 0; i < timeTable.times.length; i++) {
                if (timeTable.frequency[i] > 6) {
                    newTimes.push(timeTable.times[i].toString()+" ("+(timeTable.frequency[i]+1)+")")
                }
            }

            this.state.times = newTimes
        }
    }


    // Filter functions. Each filter item has an ID of the language/time it filters
    // That ID is added to the filter array, or removed from the filter array if the ID is already there
    // Then on update, the tweets aren't rendered if they match one of the filters
    filterTime(event) {
        var change = event.target.id;
        var newTimeFilter = this.state.timeFilter;

        if (newTimeFilter.includes(change)) {
            var index = newTimeFilter.indexOf(change);
            newTimeFilter.splice(index, 1);
        } else {
            newTimeFilter.push(change);
        }
        this.setState({timeFilter:newTimeFilter})
    }
    filterLang(event) {
        var change = event.target.id;
        var newLangFilter = this.state.langFilter;

        if (newLangFilter.includes(change)) {
            var index = newLangFilter.indexOf(change);
            newLangFilter.splice(index, 1);
        } else {
            newLangFilter.push(change);
        }
        this.setState({langFilter:newLangFilter})
    }


    render(){
        //Keeps component invisible but mounted since filters are stored in state, and I wanted filters to carry over on new tweets
        if (this.props.tweets.length == 0) return (<div></div>)

        // Declares all the state variables into much shorter-named equivalents for ease of use
        var tweets = this.props.tweets;
        var langFilter = this.state.langFilter;
        var langs = this.state.langs;
        var timeFilter = this.state.timeFilter;
        var times = this.state.times;

        var items = [];
        var anitime = 0;

        // I would have used the array.filter() function, but it just created an array that contained the original JSON, not the JSX
        // I think the filter function doesn't like it when you return something unrelated to the original array value - an entirely new value
        for (var i = 0; i < tweets.length; i++) {

            // Declares values on this loop into block-scoped variables, for ease of use
            // Although, Babel will convert let into var for compatibility
            // But, in the interest of maintaining best practice..
            let tweet = tweets[i];
            let user = tweet.user;

            if (langFilter.length != 0 && !langFilter.includes(tweet.lang)) {
            } else if (timeFilter.length != 0 && !timeFilter.includes(tweet.timestamp_ms.toString())) {
            } else {
            
                let text = '';
                let style = {
                    borderColor: "#"+user.profile_link_color, 
                    animationDelay: (0.25*anitime).toString()+"s"
                };

                // Only increases animation time when a tweet is rendered, to ensure the cascade effect remains consitent when filtered
                anitime++;

                // If the person has no profile banner, it falls back to a default background
                // Curiously, even if they do have a banner URL, it can 404, then the tweet has no background
                if (user.profile_banner_url) {
                    style.backgroundImage = "url("+user.profile_banner_url+")";
                } else {
                    style.backgroundImage = "url(background.png)";
                    style.backgroundSize = '40%';
                }

                // The text of the tweet can be truncated if it's a retweet
                // But a sample of the original tweet is included with the retweet, so it displays that instead of the original text
                // if it's a retweet
                if (tweet.retweeted_status) {
                    text = "RT @"+tweet.retweeted_status.user.screen_name+": "+tweet.retweeted_status.text+" ";
                } else {
                    text = tweet.text+" ";
                }


                // Adds tweets to the items array
                // Tweets need to all re-render every time to keep the cascade animation consistent
                // Hence the random key
                items.push((
                    <div style={style} className="animated fadeInDown tweetRow" key={Math.random()}>

                            <div className="tweetName inrow">
                                <a href={'https://twitter.com/'+user.screen_name} target="_blank">
                                    {user.name+" || @"+user.screen_name}
                                </a>
                            </div>

                        <div className={"inrow tweetText "+tweet.lang}>
                            {linkParse(text)}
                        </div>

                    </div>
                ))
            }
        }


        // Filter items have a class of true/false to change their style on activation
        var langitems = langs.map((lang, i) => {
            return (
                <div key={lang} onClick={this.filterLang} className={"filter "+langFilter.includes(lang)} id={lang}>
                    {namefind(lang)}
                </div>
            )
        })
        var timeitems = times.map((time, i) => {
            var timeint = time.replace(/\s\(.+\)/, '');
            return (
                <div key={time} onClick={this.filterTime} className={"filter "+timeFilter.includes(timeint)} id={timeint}>
                    {time}
                </div>
            )
        })

        // Filters is defined in components.js to keep this file tidier
        // The twitbox is made to be the window height to ensure the window doens't jump so much when a filter changes
        return (
            <div>
                <Filters langs={langitems} time={timeitems}/>
                <div id ="info">Here there are {items.length} tweets.<br/>
                You are seeing {((items.length/this.props.tweets.length)*100).toFixed(2)}% of tweets from the previous batch.</div>
                <div id="twitbox" style={{minHeight:window.innerHeight}}>{items}</div>
            </div>
        )
    }
}