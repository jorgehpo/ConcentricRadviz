//RadvizCore.js
//Core functions to compute radviz from Json data


function normalizeData(m) {
    var min = m[0].slice(); //copy array by value
    var max = m[0].slice(); //copy array by value
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[0].length; j++) {
            if (m[i][j] < min[j]) {
                min[j] = m[i][j];
            }
            if (m[i][j] > max[j]) {
                max[j] = m[i][j];
            }
        }
    }

    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[0].length; j++) {
            m[i][j] = (m[i][j] - min[j]) / (max[j] - min[j])
        }
    }
}


function selectColumns(data, columns) {
    var mat = [];
    columns.forEach(function (c) {
        mat.push(data[c]);
    });
    mat = numeric.transpose(mat);
    return (mat);
}


function computeAnchors(data, columns) {
    function nextChar(c){
        return (String.fromCharCode(c.charCodeAt(0)+1))
    }

    var nAngles = columns.length;
    var inc = 360 / nAngles;
    var anchors = [];
    var charID = 'A';
    anchors[0] = {name: charID, pos: 0, description: columns[0]};

    for (var i = 1; i < nAngles ; i++) {
        var newPos = anchors[i - 1].pos + inc;
        anchors[i] = {name: nextChar(anchors[i-1].name), pos: newPos, description: columns[0]};
    }
    return (anchors);
}


function radviz(data, tooltip) {
    normalizeData(data); //normalize columns [0,1]
    var nAnchors = data[0].length;
    var angle = 2 * Math.PI / nAnchors;
    var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];

    var anchors = [[0, 1]];

    for (var i = 1; i < nAnchors; i++) {
        var newAnchor = numeric.dot(rotMat, anchors[i - 1]);
        anchors.push(newAnchor);
    }


    var nrow = data.length;
    var ncol = data[0].length;
    var proj = [];
    for (var i = 0; i < nrow; i++) {
        var yi = numeric.sum(data[i]);
        var _x = 0, _y = 0;
        for (j = 0; j < ncol; j++) {
            _x = _x + anchors[j][0] * data[i][j];
            _y = _y + anchors[j][1] * data[i][j];
        }
        _x = _x / yi;
        _y = _y / yi;
        if (tooltip) {
            proj.push({x: _x, y: _y, tip: tooltip[i]});
        } else {
            proj.push({x: _x, y: _y});
        }
    }
    return (proj)
}//end - function radviz
