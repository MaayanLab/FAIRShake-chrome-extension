chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    jQuery(document).ready(function () {
        var url = tabs[0].url;
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

        function makeInsig(averages, questions) {

            scale = d3.scale.linear().domain([-1, 1])
                .interpolate(d3.interpolateRgb)
                .range([d3.rgb(255, 0, 0), d3.rgb(0, 0, 255)]);

            var body = d3.select(".fairness-bklet-insig").append("svg").attr("width", 40).attr("height", 40);

            body.selectAll("rect.fairness-bklet-insig").data(getData(averages, questions)).enter().append("rect").attr("class", "fairness-bklet-insig")
                .attr("height", getSqDimension(questions)).attr("width", getSqDimension(questions))
                .attr("id", function (d, i) {
                    return "insigBkletSq-" + (i + 1)
                })
                .attr("x", function (d) {
                    return d.posx;
                }).attr("y", function (d) {
                return d.posy;
            }).style("fill", function (d) {
                return scale(d.numdata);
            })
                .style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges")
                .on("mouseover", lessOpacity)
                .on("mouseout", restoreOpacity);
        }

        function makeBlankInsig(questions) {
            var body = d3.select(".fairness-bklet-insig").append("svg").attr("width", 40).attr("height", 40);

            body.selectAll("rect.fairness-bklet-insig").data(getBlankData(questions)).enter().append("rect").attr("class", "fairness-bklet-insig")
                .attr("id", function (d, i) {
                    return "insigBkletSq-" + (i + 1)
                })
                .attr("height", getSqDimension(questions)).attr("width", getSqDimension(questions))
                .attr("x", function (d) {
                    return d.posx;
                }).attr("y", function (d) {
                return d.posy;
            }).style("fill", "darkgray").style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges")
            .on("mouseover", lessOpacityBlank)
            .on("mouseout", restoreOpacity);
        }

        function getData(avg, qstns) {
            sqnum = qstns[(qstns.length - 1)];

            if (sqnum == 4) {
                return [{numdata: avg[0], qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {numdata: avg[1], qdata: "2. " + qstns[1], posx: 20, posy: 0},
                    {numdata: avg[2], qdata: "3. " + qstns[2], posx: 0, posy: 20},
                    {numdata: avg[3], qdata: "4. " + qstns[3], posx: 20, posy: 20}
                ]
            } else if (sqnum == 9) {
                return [{numdata: avg[0], qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {numdata: avg[1], qdata: "2. " + qstns[1], posx: 13, posy: 0},
                    {numdata: avg[2], qdata: "3. " + qstns[2], posx: 26, posy: 0},
                    {numdata: avg[3], qdata: "4. " + qstns[3], posx: 0, posy: 13},
                    {numdata: avg[4], qdata: "5. " + qstns[4], posx: 13, posy: 13},
                    {numdata: avg[5], qdata: "6. " + qstns[5], posx: 26, posy: 13},
                    {numdata: avg[6], qdata: "7. " + qstns[6], posx: 0, posy: 26},
                    {numdata: avg[7], qdata: "8. " + qstns[7], posx: 13, posy: 26},
                    {numdata: avg[8], qdata: "9. " + qstns[8], posx: 26, posy: 26}
                ]
            } else if (sqnum == 16) {
                return [{numdata: avg[0], qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {numdata: avg[1], qdata: "2. " + qstns[1], posx: 10, posy: 0},
                    {numdata: avg[2], qdata: "3. " + qstns[2], posx: 20, posy: 0},
                    {numdata: avg[3], qdata: "4. " + qstns[3], posx: 30, posy: 0},
                    {numdata: avg[4], qdata: "5. " + qstns[4], posx: 0, posy: 10},
                    {numdata: avg[5], qdata: "6. " + qstns[5], posx: 10, posy: 10},
                    {numdata: avg[6], qdata: "7. " + qstns[6], posx: 20, posy: 10},
                    {numdata: avg[7], qdata: "8. " + qstns[7], posx: 30, posy: 10},
                    {numdata: avg[8], qdata: "9. " + qstns[8], posx: 0, posy: 20},
                    {numdata: avg[9], qdata: "10. " + qstns[9], posx: 10, posy: 20},
                    {numdata: avg[10], qdata: "11. " + qstns[10], posx: 20, posy: 20},
                    {numdata: avg[11], qdata: "12. " + qstns[11], posx: 30, posy: 20},
                    {numdata: avg[12], qdata: "13. " + qstns[12], posx: 0, posy: 30},
                    {numdata: avg[13], qdata: "14. " + qstns[13], posx: 10, posy: 30},
                    {numdata: avg[14], qdata: "15. " + qstns[14], posx: 20, posy: 30},
                    {numdata: avg[15], qdata: "16. " + qstns[15], posx: 30, posy: 30}
                ]
            } else if (sqnum == 25) {
                return [{numdata: avg[0], qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {numdata: avg[1], qdata: "2. " + qstns[1], posx: 8, posy: 0},
                    {numdata: avg[2], qdata: "3. " + qstns[2], posx: 16, posy: 0},
                    {numdata: avg[3], qdata: "4. " + qstns[3], posx: 24, posy: 0},
                    {numdata: avg[4], qdata: "5. " + qstns[4], posx: 32, posy: 0},
                    {numdata: avg[5], qdata: "6. " + qstns[5], posx: 0, posy: 8},
                    {numdata: avg[6], qdata: "7. " + qstns[6], posx: 8, posy: 8},
                    {numdata: avg[7], qdata: "8. " + qstns[7], posx: 16, posy: 8},
                    {numdata: avg[8], qdata: "9. " + qstns[8], posx: 24, posy: 8},
                    {numdata: avg[9], qdata: "10. " + qstns[9], posx: 32, posy: 8},
                    {numdata: avg[10], qdata: "11. " + qstns[10], posx: 0, posy: 16},
                    {numdata: avg[11], qdata: "12. " + qstns[11], posx: 8, posy: 16},
                    {numdata: avg[12], qdata: "13. " + qstns[12], posx: 16, posy: 16},
                    {numdata: avg[13], qdata: "14. " + qstns[13], posx: 24, posy: 16},
                    {numdata: avg[14], qdata: "15. " + qstns[14], posx: 32, posy: 16},
                    {numdata: avg[15], qdata: "16. " + qstns[15], posx: 0, posy: 24},
                    {numdata: avg[16], qdata: "17. " + qstns[16], posx: 8, posy: 24},
                    {numdata: avg[17], qdata: "18. " + qstns[17], posx: 16, posy: 24},
                    {numdata: avg[18], qdata: "19. " + qstns[18], posx: 24, posy: 24},
                    {numdata: avg[19], qdata: "20. " + qstns[19], posx: 32, posy: 24},
                    {numdata: avg[20], qdata: "21. " + qstns[20], posx: 0, posy: 32},
                    {numdata: avg[21], qdata: "22. " + qstns[21], posx: 8, posy: 32},
                    {numdata: avg[22], qdata: "23. " + qstns[22], posx: 16, posy: 32},
                    {numdata: avg[23], qdata: "24. " + qstns[23], posx: 24, posy: 32},
                    {numdata: avg[24], qdata: "25. " + qstns[24], posx: 32, posy: 32},
                ]
            }
        }

        function getSqDimension(qstns) {
            sqnum = qstns[(qstns.length - 1)];
            var sqDimension = 0;
            if (sqnum == 4) {
                var sqDimension = 20;
            } else if (sqnum == 9) {
                var sqDimension = 13;
            } else if (sqnum == 16) {
                var sqDimension = 10;
            } else if (sqnum == 25) {
                var sqDimension = 8;
            }
            return sqDimension;
        }

        function getBlankData(qstns) {
            sqnum = qstns[(qstns.length - 1)];

            if (sqnum == 4) {
                return [{qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {qdata: "2. " + qstns[1], posx: 20, posy: 0},
                    {qdata: "3. " + qstns[2], posx: 0, posy: 20},
                    {qdata: "4. " + qstns[3], posx: 20, posy: 20}
                ]
            } else if (sqnum == 9) {
                return [{qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {qdata: "2. " + qstns[1], posx: 13, posy: 0},
                    {qdata: "3. " + qstns[2], posx: 26, posy: 0},
                    {qdata: "4. " + qstns[3], posx: 0, posy: 13},
                    {qdata: "5. " + qstns[4], posx: 13, posy: 13},
                    {qdata: "6. " + qstns[5], posx: 26, posy: 13},
                    {qdata: "7. " + qstns[6], posx: 0, posy: 26},
                    {qdata: "8. " + qstns[7], posx: 13, posy: 26},
                    {qdata: "9. " + qstns[8], posx: 26, posy: 26}
                ]
            } else if (sqnum == 16) {
                return [{qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {qdata: "2. " + qstns[1], posx: 10, posy: 0},
                    {qdata: "3. " + qstns[2], posx: 20, posy: 0},
                    {qdata: "4. " + qstns[3], posx: 30, posy: 0},
                    {qdata: "5. " + qstns[4], posx: 0, posy: 10},
                    {qdata: "6. " + qstns[5], posx: 10, posy: 10},
                    {qdata: "7. " + qstns[6], posx: 20, posy: 10},
                    {qdata: "8. " + qstns[7], posx: 30, posy: 10},
                    {qdata: "9. " + qstns[8], posx: 0, posy: 20},
                    {qdata: "10. " + qstns[9], posx: 10, posy: 20},
                    {qdata: "11. " + qstns[10], posx: 20, posy: 20},
                    {qdata: "12. " + qstns[11], posx: 30, posy: 20},
                    {qdata: "13. " + qstns[12], posx: 0, posy: 30},
                    {qdata: "14. " + qstns[13], posx: 10, posy: 30},
                    {qdata: "15. " + qstns[14], posx: 20, posy: 30},
                    {qdata: "16. " + qstns[15], posx: 30, posy: 30}
                ]
            } else if (sqnum == 25) {
                return [{qdata: "1. " + qstns[0], posx: 0, posy: 0},
                    {qdata: "2. " + qstns[1], posx: 8, posy: 0},
                    {qdata: "3. " + qstns[2], posx: 16, posy: 0},
                    {qdata: "4. " + qstns[3], posx: 24, posy: 0},
                    {qdata: "5. " + qstns[4], posx: 32, posy: 0},
                    {qdata: "6. " + qstns[5], posx: 0, posy: 8},
                    {qdata: "7. " + qstns[6], posx: 8, posy: 8},
                    {qdata: "8. " + qstns[7], posx: 16, posy: 8},
                    {qdata: "9. " + qstns[8], posx: 24, posy: 8},
                    {qdata: "10. " + qstns[9], posx: 32, posy: 8},
                    {qdata: "11. " + qstns[10], posx: 0, posy: 16},
                    {qdata: "12. " + qstns[11], posx: 8, posy: 16},
                    {qdata: "13. " + qstns[12], posx: 16, posy: 16},
                    {qdata: "14. " + qstns[13], posx: 24, posy: 16},
                    {qdata: "15. " + qstns[14], posx: 32, posy: 16},
                    {qdata: "16. " + qstns[15], posx: 0, posy: 24},
                    {qdata: "17. " + qstns[16], posx: 8, posy: 24},
                    {qdata: "18. " + qstns[17], posx: 16, posy: 24},
                    {qdata: "19. " + qstns[18], posx: 24, posy: 24},
                    {qdata: "20. " + qstns[19], posx: 32, posy: 24},
                    {qdata: "21. " + qstns[20], posx: 0, posy: 32},
                    {qdata: "22. " + qstns[21], posx: 8, posy: 32},
                    {qdata: "23. " + qstns[22], posx: 16, posy: 32},
                    {qdata: "24. " + qstns[23], posx: 24, posy: 32},
                    {qdata: "25. " + qstns[24], posx: 32, posy: 32},
                ]
            }
        }

        function roundTwo(num) {
            return +(Math.round(num + "e+2") + "e-2");
        }

        function lessOpacity(d, i) {
            d3.select("#insigBkletSq-" + (i + 1)).style("fill-opacity", .3);
            var div = d3.select("body").append("div")
                .attr("class", "tooltip").attr("id", "fairnessBkletTooltip");


            div.transition().style("opacity", 1);
            div.html("Score: " + roundTwo(d.numdata) + "<br>" + d.qdata);
        }

        function lessOpacityBlank(d, i) {
            d3.select("#insigBkletSq-" + (i + 1)).style("fill-opacity", .3);
            var div = d3.select("body").append("div")
                .attr("class", "tooltip").attr("id", "fairnessBkletTooltip");

            div.transition().style("opacity", 1);
            div.html("Score: " + "N/A" + "<br>" + d.qdata);
        }

        function restoreOpacity(d, i) {
            d3.select("#insigBkletSq-" + (i + 1)).style("fill-opacity", 1);
            d3.selectAll("#fairnessBkletTooltip").remove();
        }

        function notFound() {
            document.getElementById("fairshakeBkletInfo").appendChild(document.createTextNode("FAIRness data unavailable."));
        }
    });
});