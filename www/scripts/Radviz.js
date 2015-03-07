function Radviz(data, columns, tooltip){
        this.setData(data,columns, tooltip);
}

Radviz.prototype.setAnchors = function(anchors) {
    console.log("setAnchors");
    console.log(anchors);
};

Radviz.prototype.updateAnchors = function(anchors) {
    console.log("setAnchors");
    console.log(anchors);
};

Radviz.prototype.computeProjection = function() {
    if (!this.matrix){
        throw "Error: Data matrix not available.";
    }
    var nAnchors = this.matrix[0].length;
    var angle = 2 * Math.PI / nAnchors;
    var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];

    var anchors = [[0, 1]];

    for (var i = 1; i < nAnchors; i++) {
        var newAnchor = numeric.dot(rotMat, anchors[i - 1]);
        anchors.push(newAnchor);
    }


    var nrow = this.matrix.length;
    var ncol = this.matrix[0].length;
    var proj = [];
    for (var i = 0; i < nrow; i++) {
        var yi = numeric.sum(this.matrix[i]);
        var _x = 0, _y = 0;
        for (j = 0; j < ncol; j++) {
            _x = _x + anchors[j][0] * this.matrix[i][j];
            _y = _y + anchors[j][1] * this.matrix[i][j];
        }
        _x = _x / yi;
        _y = _y / yi;
        if (this.tooltip) {
            proj.push({x: _x, y: _y, tip: this.tooltip[i]});
        } else {
            proj.push({x: _x, y: _y});
        }
    }
    return (proj)
};//end - function radviz



Radviz.prototype.setData = function(data, columns, tooltip){
    this.data = data;
    this.columns = columns;
    this.tooltip = tooltip;
    this.matrix = this.selectColumns(data,columns);
};

Radviz.prototype.normalizeData = function(mat) {
    var min = mat[0].slice(); //copy array by value
    var max = mat[0].slice(); //copy array by value
    var nrow = mat.length;
    var ncol = mat[0].length;
    for (var i = 0; i < nrow; i++) {
        for (var j = 0; j < ncol; j++) {
            if (mat[i][j] < min[j]) {
                min[j] = mat[i][j];
            }
            if (mat[i][j] > max[j]) {
                max[j] = mat[i][j];
            }
        }
    }

    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            mat[i][j] = (mat[i][j] - min[j]) / (max[j] - min[j])
        }
    }
};

Radviz.prototype.selectColumns = function(data, columns) {
    var mat = [];
    if (!columns){
        columns = Object.keys(data);
    }
    columns.forEach(function (c) {
        mat.push(data[c]);
    });
    mat = numeric.transpose(mat);
    this.normalizeData(mat);
    return (mat);
};


Radviz.prototype.createAnchors = function(data, columns) {
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
        anchors[i] = {name: nextChar(anchors[i-1].name), pos: newPos, description: columns[i]};
    }
    return (anchors);
};

Radviz.prototype.getDimensionNames = function () {
    return Object.keys(this.data);
};