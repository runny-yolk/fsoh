const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function(text){
    // For some reaason the $ for end of input in the reg exp below doesn't recognise the end of input
    // But recognises \s, as it should, so I added a space at the end of input
    text = text+" ";

    // To add JSX objects into the text string, the first step was to seperate out what needs to be made into JSX
    text = text.replace(/([https://]*\w+(?=\.\w)\.[\w| /|.]+)[\s|\n|$]/g, ' mhrtkfbuf$1mhrtkfbuf ')
    .replace(/#(.*?)\s|#|#/g, ' mhrtkfbuf#$1mhrtkfbuf ')
    .replace(/@(.*?)\s|@|@/g, ' mhrtkfbuf@$1mhrtkfbuf ');

    // Array.filter() treats the value its callback returns as a condition as well as a value
    // Therefore, if the value is false, it gets removed from the array
    // An empty string is considered false, these can sometimes occur
    text = text.split(/mhrtkfbuf/).filter(value => value);

    var result = [];

    for (var i = 0; i < text.length; i++) {
        let value = text[i];
        
        //Replaces strings with a relevant link for each item
        if (/^@/.test(value)){
            let urltext = text[i].replace(/@|#|:/g, '')
            result.push(
                (
                    <a target="_blank" href={"https://twitter.com/"+urltext}>{value}</a>
                )
            )
        } else if (/^#/.test(value)) {
            let urltext = text[i].replace(/@|#|:/g, '')
            result.push(
                (
                    <a target="_blank" href={"https://twitter.com/hashtag/"+urltext}>{value}</a>
                )
            )
        } else if (/^http/.test(value)) {
            result.push(
                (
                    <a target="_blank" href={value}>{value}</a>
                )
            )
        } else {
            // Ensures that anything that doesn't need to be a link gets pushed
            result.push(value)
        }
    }

    return result
}