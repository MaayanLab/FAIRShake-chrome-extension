chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;
    var insignia = require("./scripts/insignia.js")
    var jQuery = require("jquery")
//    ],function(insignia){
        var questions = JSON.parse(jQuery.ajax({
            async: false,
            url: 'https://fairshake.cloud/api/getQ?',
            data: {
                'url': url
            }
        }).responseText);

        if (questions == undefined || questions == 'None') {
            notFound();
        } else {
            document.getElementById("fairshakeBkletInfo").appendChild(document.createTextNode("FAIRness Insignia"));
            document.getElementById("fairshakeBkletInfo").appendChild(document.createElement("br"));
            document.getElementById("fairshakeBkletInfo").appendChild(document.createTextNode(questions[(questions.length) - 3]));
            var fairshakeLink = document.getElementById("fairshakeBkletLink");
            fairshakeLink.appendChild(document.createTextNode("Submit evaluation"));
            fairshakeLink.setAttribute("href", "https://fairshake.cloud/newevaluation?resourceid=" + questions[(questions.length) - 2]);

            jQuery.ajax({
                async: false,
                url: 'https://fairshake.cloud/api/getAvg?',
                data: {
                    'url': url
                },
                success: function (data) {
                    if (data == 'None') {
                        makeBlankInsig(questions);
                    } else {
                        makeInsig(data, questions);
                    }
                }
            });
        }

        function makeBlankInsig(questions) {
        }

        function makeInsig(scoreReturned, questions){
            scoreDict = {}
            for (i=0;i<scoreReturned.length;i++){
                scoreDict[(i+1)] = scoreReturned[i];
            }
            scores = {1: scoreDict};
            insignia.build_svg(".fairness-bklet-insig",scores,questions);
        }

        function notFound() {
            document.getElementById("fairshakeBkletInfo").appendChild(document.createTextNode("FAIRness data unavailable."));
        }
//    });
});