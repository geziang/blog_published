function semanticUiMySearch() {

    var apiurl = mysearch.apiurl;
	var source = mysearch.source;
	
	function doSearch(key) {
		$.post(apiurl,{key:key, source:source},function(result){
			renderHits(result);
		});
	}

    function renderHits(content) {
        $('#search-results').html(function () {
            return $.map(content, function (hit) {
                return renderHit(hit)
            });
        });
    }

    function renderHit(hit) {
        var result = '';
        result = result + '<div class="item"><div class="content"><a class="header" href="' + hit.url + '">';
        result = result + hit.title;
        result = result + '</a><div class="description search-result-tags">';
        result = result + renderTags(hit.highlightTags, hit.tags);
        result = result + '</div></div></div>';
        return result;
    }

    function renderTags(tags, tagsRaw) {
        var result = '<i class="tags icon"></i>';

		if (tags) {
			for (var i = 0; i < tags.length; i++) {
				var tag = tags[i];
				var tagRaw = tagsRaw[i];
				var string = tag;
				if (string.indexOf('<span class="highlight">') != -1) {
					var temp = string.replace('<span class="highlight">', '').replace('</span>', '');
					result = result + '<span class="ui mini blue label">' + temp + '</span>';
				} else {
					result = result + '<span class="ui mini label">' + string + '</span>';
				}
			}
		}

        return result;
    }

    function reset() {
        $('#search-results').empty();
        $('#search-box').val('');
    }

    $('#search-box').on('keyup', function () {

        if ($(this).val() == '') {
            reset();
        } else {
            doSearch($(this).val());
        }

    });

    $('#search-input').on('focus click keyup keypress', function () {
        $('#search-modal')
            .modal({
                inverted: true,
                observeChanges: true,
                onVisible: function () {
                    $("#search-input").blur();
                    $("#search-input").val('');
                },
                onHidden: reset
            }).modal('show');

    })

}

if(mySearchEnabled) {
    semanticUiMySearch();
}