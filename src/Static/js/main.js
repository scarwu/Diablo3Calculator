'use strict';

function getProfile(host, battle_tag) {
    var name = battle_tag.split('#')[0],
        code = battle_tag.split('#')[1],
        url = 'http://' + host + '.battle.net/api/d3/profile/' + name + '-' + code + '/';

    $.getJSON(url, function (data) {
        console.log(data);
    });
}

$(document).ready(function () {
    getProfile('us', '刀疤送客#3474');
});
