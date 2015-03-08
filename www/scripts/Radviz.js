function Radviz(data, tooltip){
        if (!data){
            throw "Error. Radviz requires a dataset to work with."
        }
        this.data = data;
        this.tooltip = tooltip;
        this.matrix = [[]];
}

Radviz.prototype.setAnchors = function(anchors) {
    //compute matrix data again, from data and columns
    var colNames = [];
    this.anchorAngles = [];
    var _this = this;
    anchors.forEach(function(a){
        if (!a.available) {
            colNames.push(a.attribute);
            _this.anchorAngles.push((a.pos*Math.PI*2)/360); //converts from degree (D3) to radians (js math)
        }
    });
    this.matrix = this.selectColumns(colNames);

    this.yi = []; //used in computeProjection method. Only needs to be updated when data changes
    this.matrix.forEach(function (x){
        var aux_yi = numeric.sum(x);
        if (aux_yi == 0) aux_yi = 1;
        _this.yi.push(aux_yi);
    });
};

Radviz.prototype.updateAnchors = function(anchors) {
    //console.log("setAnchors");
    //console.log(anchors);
    this.anchorAngles = [];
    var _this = this;
    anchors.forEach(function(a){
        if (!a.available) {
            _this.anchorAngles.push((a.pos*Math.PI*2)/360); //converts from degree (D3) to radians (js math)
        }
    });
};

Radviz.prototype.anglesToXY = function(){ //transform this.anchorAngles to position matrix[[x,y]] and returns
    var initPoint = [1,0];
    var anchorMatrix = [];
    this.anchorAngles.forEach(function(angle){
        var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
        anchorMatrix.push(numeric.dot(rotMat,initPoint));
    });
    return anchorMatrix;
};

Radviz.prototype.computeProjection = function() {

    if (this.matrix[0].length == 0){
        //throw "Error: Data matrix not available.";
        return ([]);
    }

    var anchors = this.anglesToXY();


    var nrow = this.matrix.length;
    var ncol = this.matrix[0].length;
    var proj = [];
    for (var i = 0; i < nrow; i++) {
        var _x = 0, _y = 0;
        for (var j = 0; j < ncol; j++) {
            _x = _x + anchors[j][0] * this.matrix[i][j];
            _y = _y + anchors[j][1] * this.matrix[i][j];
        }
        _x = _x / this.yi[i];
        _y = _y / this.yi[i];
        if (this.tooltip) {
            proj.push({x: _x, y: _y, tip: this.tooltip[i]});
        } else {
            proj.push({x: _x, y: _y});
        }
    }
    return (proj)
};//end - function radviz

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

Radviz.prototype.selectColumns = function(columns) {
    var mat = [];
    if (columns.length == 0){
        return [[]];
    }
    var _this = this;
    columns.forEach(function (c) {
        mat.push(_this.data[c]);
    });
    mat = numeric.transpose(mat);
    this.normalizeData(mat);
    return (mat);
};

Radviz.prototype.getDimensionNames = function () {
    return Object.keys(this.data);
};