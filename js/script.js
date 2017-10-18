function loadData() {

    var $body = $('body');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $wikiHeaderElem = $('#wikipedia-header')
    var $wikiElem = $('#wikipedia-links');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var viewStreet = $("#street").val();
    var viewCity = $("#city").val();
    var viewLocation = viewStreet + ", " + viewCity;
    $greeting.text('So you want to live at ' + viewLocation + '?');
    var streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=800x600&location=" + viewLocation;
    $body.append('<img class="bgimg" src = "' + streetviewURL + '">');

    //load Times
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + viewCity + '&sort=newest&api-key=c91dd71c5e714b2d95493136687abbfc';
    $.getJSON(nytimesUrl, function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + viewCity);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        };

    }).fail(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
    //load Wikipedia
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + viewCity + '&format=json&callback-wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 5000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}
$('#form-container').submit(loadData);