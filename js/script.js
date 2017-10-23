var $body;
var $nytHeaderElem;
var $nytElem;
var $wikiHeaderElem;
var $wikiElem;
var $greeting;
var viewStreet;
var viewCity;

function main() {

    function loadData() {
        prepareDOMElements();
        loadStreetViewData();
        loadNyTimesData();
        loadWikipediaData();
        clearData();

        return false;
    }
    $("#form-container").submit(loadData)
}

function prepareDOMElements() {
    $body = $('body');
    $nytHeaderElem = $('#nytimes-header');
    $nytElem = $('#nytimes-articles');
    $wikiHeaderElem = $('#wikipedia-header')
    $wikiElem = $('#wikipedia-links');
    $greeting = $('#greeting');
    viewStreet = $("#street").val();
    viewCity = $("#city").val();
}

function clearData() {
    $wikiElem.text("");
    $nytElem.text("");
}

function loadStreetViewData() {
    var viewLocation = viewStreet + ", " + viewCity;
    $greeting.text('So you want to live at ' + viewLocation + '?');
    var streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=800x600&location=" + viewLocation;
    $body.append('<img class="bgimg" src = "' + streetviewURL + '">');
}

function loadNyTimesData() {
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + viewCity + '&sort=newest&api-key=c91dd71c5e714b2d95493136687abbfc';
    $.getJSON(nytimesUrl, {}).done(function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + viewCity);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        }
    }).fail(function() {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
}

function loadWikipediaData() {
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + viewCity + '&format=json&callback-wikiCallback';
    $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
        })
        .done(function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
        }).fail(function() {
            $wikiElem.text('Wikipedia Articles Could Not Be Loaded');
        });
}
$(main);
