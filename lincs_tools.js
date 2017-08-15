$("head").append('<style type="text/css">.submithere{ display: none;}</style>');
$("head").append('<style type="text/css">.Tool__cover___2YVP7,.Tool__tool-inner___1jHjr{height: 13.5rem;}</style>');
$("head").append('<style type="text/css">.insignia{ position: absolute; top:138px; right:40px;}</style>');
$("head").append('<style type="text/css">.Tool__tool-img-wrap___2EIiY {height: 13.5rem;}</style>');
$("head").append('<style type="text/css">#fairlabel{text-align:center; font-size:.85rem; color:black; font-weight:500; padding-bottom:4px; line-height:12px;}</style>');
$("head").append('<style type="text/css">.insigLabel{display:block; margin:auto;}</style>');
$("head").append('<style type="text/css">svg{display:block; margin:auto;}</style>');

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
    var theQ = $.ajax({
        async: false,
        url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getQ?',
        data: {
            'theType': 'Tool'
        },
        success: function (data) {
            return data
        }
    }).responseText;

    var tQuestions = theQ.split(/u'|u"/);

    for (i = 0; i <= 16; i++) { //tQuestions[0] is [
        tQuestions[i] = tQuestions[i].replace(/',/g, '');
        tQuestions[i] = tQuestions[i].replace(/']/g, '');
    }

    var aTool = $(".AppsView__workflow___3VDBQ").eq(1).find('.col-xl-4')

    $(aTool).each(function () {
        var tempArr = [];
        var theName = $(this).find('a[class="Tool__tool-title___Okbnd"]').text();
        var theURL = $(this).find('a[class="Tool__tool-title___Okbnd"]').attr('href');
        var theDescrip = $(this).find('.Tool__tool-description___1PV7U').text();
        tempArr.push(theName, theURL, theDescrip);

        var theAvg = $.ajax({
            async: false,
            url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getAvg?',
            data: {
                'select': 'name',
                'theName': theName
            },
            success: function (data) {
                return data
            }
        }).responseText;
        // alert(theAvg)

        tempArr.push(theAvg, tQuestions);
        arr.push(tempArr);
    });
    addInsigs(arr,aTool);


});



function addInsigs(arr,aTool) {
        $(aTool).each(function (i) {
            $(this).find('.Tool__tool-details___RCMXx').prepend(
                '<div class="insignia"><div id="fairlabel">FAIRness<br>Assessment</div>'
                + '<form action="https://amp.pharm.mssm.edu/fairshake/redirectedFromExt" method="POST" target="_blank">'
                + '<input type="hidden" name="theName" value="' + arr[i][0]
                + '"><input type="hidden" name="theURL" value="' + arr[i][1]
                + '"><input type="hidden" name="theDescrip" value="' + arr[i][2]  // only remove italicize formatting in submission of form
                + '"><input type="hidden" name="theType" value="Tool">'
                + '<input type="hidden" name="theSrc" value="LINCS Tools">'
                + '<div><label class="insigLabel" id="forInsig' + (i + 1) + '"><input type="submit" class="submithere"/></label></div></form></div>');

            if (arr[i][3] === 'None') {
                makeBlankInsig(arr[i][4], "#forInsig" + (i + 1), (i + 1));
            } else {
                makeInsig(arr[i][3], arr[i][4], "#forInsig" + (i + 1), (i + 1));
            }
        });
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
    var div = d3.select('body').append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + roundTwo(d.numdata) + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function opacBlank(d, i) {
    d3.select("#insigSq-" + d.insigIndex + "-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select('body').append("div")
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