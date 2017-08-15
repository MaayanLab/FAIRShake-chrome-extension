$(".col-md-9").find('ul').attr("id", "removedList");
$("head").append('<style type="text/css">#removedList{ display: none;}</style>');
$("head").append('<style type="text/css">.submithere{ display: none;}</style>')
$("head").append('<style type="text/css">div.tooltip {' +
    'position: absolute;' +
    'padding: 2px;' +
    'font: 13px sans-serif;' +
    'background: black;' +
    'color:white;' +
    'border-radius:2px;' +
    'pointer-events: none;' +
    'max-width: 300px;' +
    '}</style>');

$(document).ready(function () {
    var arr = [];
    var repoQ = $.ajax({
        async: false,
        url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getQ?',
        data: {
            'theType': 'Repository'
        },
        success: function (data) {
            return data
        }
    }).responseText;
    var tQuestions = repoQ.split("u'");
    for (i = 0; i <= 16; i++) {
        tQuestions[i] = tQuestions[i].replace(/',/g, '');
        tQuestions[i] = tQuestions[i].replace(/']/g, '');
    }


    $(".col-md-9").find('li').each(function () {
        var tempArr = [];
        var repoName = $(this).find('strong').text();
        var repoURL = $(this).find('a').attr('href');
        var repoDescrip = $.trim($(this).html().split("<br>")[2]);
        tempArr.push(repoName, repoURL, repoDescrip);

        var repoAvg = $.ajax({
            async: false,
            url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getAvg?',
            data: {
                'select': 'URL',
                'theURL': repoURL
            },
            success: function (data) {
                return data
            }
        }).responseText;

        tempArr.push(repoAvg, tQuestions);
        arr.push(tempArr);
    });
    addInsigTable(arr);

});



function addInsigTable(arr) {
    $('<div><table class="table table-responsive">' +
        '<thead><tr><th>Name</th><th>URL</th><th>Description</th><th>FAIRness Assessment</th></tr></thead>' +
        '<tbody></tbody></table></div>').insertBefore($(".topofpage"));
    for (i = 0; i <= arr.length; i++) {
        $('tbody').append('<tr class="tablerow" ><td>' + arr[i][0] + '</td>' + '<td>' + arr[i][1] + '</td>'
            + '<td>' + arr[i][2]  // do not remove italicize formatting in creation of table
            + '</td><td id="rowForInsig' + (i + 1) + '">'
            + '<div class="insignia"><div><form action="https://amp.pharm.mssm.edu/fairshake/redirectedFromExt" method="POST" target="_blank">'
            + '<input type="hidden" name="theName" value="' + arr[i][0]
            + '"><input type="hidden" name="theURL" value="' + arr[i][1]
            + '"><input type="hidden" name="theDescrip" value="' + jQuery('<p>' + arr[i][2] + '</p>').text()  // only remove italicize formatting in submission of form
            + '"><input type="hidden" name="theType" value="Repository">'
            + '<input type="hidden" name="theSrc" value="MOD">'
            + '<div><label id="forInsig' + (i + 1) + '"><input type="submit" class="submithere"/></label></div></form></div></div></td></tr>');

        if (arr[i][3] === 'None') {
            makeBlankInsig(arr[i][4], "#forInsig" + (i + 1), (i + 1));
        } else {
            makeInsig(arr[i][3], arr[i][4], "#forInsig" + (i + 1), (i + 1));
        }

    }
}

function makeInsig(avg, qstns, position, insigIndex) {

    var scale = d3.scaleLinear().domain([-1, 1])
        .interpolate(d3.interpolateRgb)
        .range([d3.rgb(255, 0, 0), d3.rgb(0, 0, 255)]);

    var body = d3.select(position).append("svg").attr("width", 40).attr("height", 40);

    body.selectAll("rect.insig").data(getData(avg, qstns, insigIndex,'insig')).enter().append("rect").attr("class", "insig")
        .attr("id", function (d, i) {
            return "insigSq-" + d.insigIndex + "-" + (i + 1)
        })
        .attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill", function (d) {
        return scale(d.numdata);
    })
        .style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges")
    ;

    body.selectAll("rect.btn").data(getData(avg, qstns, insigIndex,'btn')).enter().append("rect").attr("class", "btn").attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill-opacity", 0)
        .on("mouseover", opac)
        .on("mouseout", bopac)
    ;

}

function makeBlankInsig(qstns, position, insigIndex) {
    var body = d3.select(position).append("svg").attr("width", 40).attr("height", 40);

    body.selectAll("rect.insig").data(getBlankData(qstns, insigIndex)).enter().append("rect").attr("class", "insig")
        .attr("width", 10).attr("height", 10)
        .attr("id", function (d, i) {
            return "insigSq-" + d.insigIndex + "-" + (i + 1)
        })
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill", "darkgray").style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges");

    body.selectAll("rect.btn").data(getBlankData(qstns, insigIndex)).enter().append("rect").attr("class", "btn").attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill-opacity", 0)
        .on("mouseover", opacBlank)
        .on("mouseout", bopac)
    ;
}


function getData(avg, qstns, insigIndex,testvar) {

    var avgAns = avg.split(",");

    return [{insigIndex: insigIndex, numdata: avgAns[0], qdata: "1. "+qstns[1], posx: 0, posy: 0},
        {insigIndex: insigIndex, numdata: avgAns[1], qdata: "2. "+qstns[2], posx: 10, posy: 0},
        {insigIndex: insigIndex, numdata: avgAns[2], qdata: "3. "+qstns[3], posx: 20, posy: 0},
        {insigIndex: insigIndex, numdata: avgAns[3], qdata: "4. "+qstns[4], posx: 30, posy: 0},
        {insigIndex: insigIndex, numdata: avgAns[4], qdata: "5. "+qstns[5], posx: 0, posy: 10},
        {insigIndex: insigIndex, numdata: avgAns[5], qdata: "6. "+qstns[6], posx: 10, posy: 10},
        {insigIndex: insigIndex, numdata: avgAns[6], qdata: "7. "+qstns[7], posx: 20, posy: 10},
        {insigIndex: insigIndex, numdata: avgAns[7], qdata: "8. "+qstns[8], posx: 30, posy: 10},
        {insigIndex: insigIndex, numdata: avgAns[8], qdata: "9. "+qstns[9], posx: 0, posy: 20},
        {insigIndex: insigIndex, numdata: avgAns[9], qdata: "10. "+qstns[10], posx: 10, posy: 20},
        {insigIndex: insigIndex, numdata: avgAns[10], qdata: "11. "+qstns[11], posx: 20, posy: 20},
        {insigIndex: insigIndex, numdata: avgAns[11], qdata: "12. "+qstns[12], posx: 30, posy: 20},
        {insigIndex: insigIndex, numdata: avgAns[12], qdata: "13. "+qstns[13], posx: 0, posy: 30},
        {insigIndex: insigIndex, numdata: avgAns[13], qdata: "14. "+qstns[14], posx: 10, posy: 30},
        {insigIndex: insigIndex, numdata: avgAns[14], qdata: "15. "+qstns[15], posx: 20, posy: 30},
        {insigIndex: insigIndex, numdata: avgAns[15], qdata: "16. "+qstns[16], posx: 30, posy: 30}]
}

function getBlankData(qstns, insigIndex) {


    return [{insigIndex: insigIndex, qdata: "1. "+qstns[1], posx: 0, posy: 0},
        {insigIndex: insigIndex, qdata: "2. "+qstns[2], posx: 10, posy: 0},
        {insigIndex: insigIndex, qdata: "3. "+qstns[3], posx: 20, posy: 0},
        {insigIndex: insigIndex, qdata: "4. "+qstns[4], posx: 30, posy: 0},
        {insigIndex: insigIndex, qdata: "5. "+qstns[5], posx: 0, posy: 10},
        {insigIndex: insigIndex, qdata: "6. "+qstns[6], posx: 10, posy: 10},
        {insigIndex: insigIndex, qdata: "7. "+qstns[7], posx: 20, posy: 10},
        {insigIndex: insigIndex, qdata: "8. "+qstns[8], posx: 30, posy: 10},
        {insigIndex: insigIndex, qdata: "9. "+qstns[9], posx: 0, posy: 20},
        {insigIndex: insigIndex, qdata: "10. "+qstns[10], posx: 10, posy: 20},
        {insigIndex: insigIndex, qdata: "11. "+qstns[11], posx: 20, posy: 20},
        {insigIndex: insigIndex, qdata: "12. "+qstns[12], posx: 30, posy: 20},
        {insigIndex: insigIndex, qdata: "13. "+qstns[13], posx: 0, posy: 30},
        {insigIndex: insigIndex, qdata: "14. "+qstns[14], posx: 10, posy: 30},
        {insigIndex: insigIndex, qdata: "15. "+qstns[15], posx: 20, posy: 30},
        {insigIndex: insigIndex, qdata: "16. "+qstns[16], posx: 30, posy: 30}]
}

function roundTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function opac(d, i) {
    d3.select("#insigSq-" + d.insigIndex + "-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select('#contentarea').append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + roundTwo(d.numdata) + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function opacBlank(d, i) {
    d3.select("#insigSq-" + d.insigIndex + "-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select('#contentarea').append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + 'N/A' + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function bopac(d, i) {
    d3.select("#insigSq-" + d.insigIndex + "-" + (i + 1)).style("fill-opacity", 1);
    d3.selectAll("#fairtt").remove();
}





