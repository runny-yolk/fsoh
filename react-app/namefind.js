// Gets JSON file of ISO-639 language designations
// I created this file from the HTML of the Wikipedia page that has a table of the designations
// Used several different regular expressions to replace HTML with JSON and remove everything extraneous
const iso = require('./iso639.json');

module.exports = function(code){
    // Twitter used und to designate tweets with no discernable language, like tweets that are all emoji
    if (code == "und"){
        return "Undefined"
    }
    // Have a quick look at the JSON, the rest of this is pretty self explanatory
    for (var i = 0; i < iso.length; i++) {
        if (code.length == 2) {
            if (code == iso[i].alpha2) {
                return iso[i].name;
            }
        }
        if (code.length == 3) {
            if (code == iso[i].alpha3) {
                return iso[i].name;
            }
            if (iso[i].alpha3en){
                if (code == iso[i].alpha3en){
                    return iso[i].name
                }
            }
        }
    }
    return "???";
}