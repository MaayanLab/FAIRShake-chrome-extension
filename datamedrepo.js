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
$("head").append('<style type="text/css">.insigCol{ text-align:center; }</style>')
$("head").append('<style type="text/css">#fairCol{ text-align:center; }</style>')
$("head").append('<style type="text/css">th{ font-weight:900; font-size:17px; padding-bottom:10px; }</style>')


$(document).ready(function () {
    $("table").append('<thead><th></th><th></th><th>Repository Name</th><th>Description</th><th id="fairCol">FAIRness Assessment</th>');
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

    var repoURLs = ['https://www.ebi.ac.uk/arrayexpress/', 'https://www.ncbi.nlm.nih.gov/bioproject/',
        'http://www.bmrb.wisc.edu/','http://cvrgrid.org/','http://www.cellimagelibrary.org/','https://www.ncbi.nlm.nih.gov/clinvar/',
        'https://datashare.nida.nih.gov/','https://clinicaltrials.gov','http://thedata.org/','http://www.datadryad.org',
        'http://www.chibi.ubc.ca/Gemma','http://www.ncbi.nlm.nih.gov/geo/','http://www.genenetwork.org/',
        'https://portal.gdc.cancer.gov/projects','https://gtexportal.org/home/','http://www.hgvs.org/dblist/glsdb.htm',
        'http://www.immport.org','http://www.icpsr.umich.edu/','http://www.metabolomicsworkbench.org/','http://phenome.jax.org/',
        'https://www.niddkrepository.org/','http://www.nitrc.org/ir/','https://sleepdata.org/','https://ndar.nih.gov/','http://neuromorpho.org/',
        'http://neurovault.org/','http://neurovault.org/collections/','http://neurovault.org/','http://www.nursa.org/','http://www.omicsdi.org/','http://openfmri.org/',
        'http://www.peptideatlas.org/','http://physionet.org/physiobank/','http://www.proteomexchange.org/','http://www.rcsb.org/pdb/',
        'http://rgd.mcw.edu/','http://www.nature.com/sdata/','https://www.ncbi.nlm.nih.gov/sra/','https://simtk.org/',
        'http://www.cancerimagingarchive.net/','http://www.ebi.ac.uk/pdbe/emdb/','http://www.gensat.org/retina.jsp',
        'https://www.ncbi.nlm.nih.gov/gap','http://www.uniprot.org/','https://www.vectorbase.org/','http://www.wormbase.org/',
        'http://medicine.yale.edu/keck/nida/yped.aspx',
        'Common Fund Repositories',
        'http://lincsportal.ccs.miami.edu/datasets/','http://www.roadmapepigenomics.org/',
        'DataCite',
        'https://clients.adaptivebiotech.com/immuneaccess/browse','https://www.ada.edu.au/','https://bils.se/','http://iaf.virtualbrain.org/xnat/',
        'http://www.cxidb.org/','http://crcns.org','http://databrary.org/','https://figshare.com/','http://www.neuroinf.de',
        'http://gigadb.org/','https://archive.data.jhu.edu','http://datacompass.lshtm.ac.uk/','http://wiley.biolucida.net/',
        'https://physionet.org/physiobank/database/','http://www.morphobank.org','http://www.nimh.nih.gov/','https://peerj.com/',
        'https://www.dza.de/fdz/deutscher-alterssurvey/deas-dokumentation/doi-deas.html','https://data.sbgrid.org/','https://www.ccdc.cam.ac.uk/',
        'https://www.thieme.de/','http://www.signaling-gateway.org/','https://dash.ucop.edu/stash','http://www.data-archive.ac.uk/','https://zenodo.org/'];
    $("tbody").find('tr').each(function (index) {
        if (!(index === 47 || index === 50 )){
            var tempArr = [];
            var repoName = $(this).find('a').text();
            var repoURL = repoURLs[index];
            var repoDescrip = $(this).find('td').eq(3).text();
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

            $(this).append('<td class="insigCol col-xs-1 ">'
                + '<div class="insignia"><div><form action="https://amp.pharm.mssm.edu/fairshake/redirectedFromExt" method="POST" target="_blank">'
                + '<input type="hidden" name="theName" value="' + repoName
                + '"><input type="hidden" name="theURL" value="' + repoURL
                + '"><input type="hidden" name="theDescrip" value="' + repoDescrip
                + '"><input type="hidden" name="theType" value="Repository">'
                + '<input type="hidden" name="theSrc" value="DataMed">'
                + '<div><label id="forInsig' + (index + 1) + '"><input type="submit" class="submithere"/></label></div></form></div></div></td>');

            if (repoAvg === 'None') {
                makeBlankInsig(tQuestions, "#forInsig" + (index + 1), (index + 1));
            } else {
                makeInsig(repoAvg, tQuestions, "#forInsig" + (index + 1), (index + 1));
            }

        } else {
            arr.push('Not repository');
        }
    });
});

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
    var div = d3.select(this.parentNode.parentNode).append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + roundTwo(d.numdata) + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function opacBlank(d, i) {
    d3.select("#insigSq-" + d.insigIndex + "-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select(this.parentNode.parentNode).append("div")
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