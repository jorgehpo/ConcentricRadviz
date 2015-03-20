function Radviz(data){
    if (!data){
        throw "Error. Radviz requires a dataset to work with."
    }
    this.setData(data);
    this.isContinuous = true;
    this.matrix = [[]];
    this.dimNames = Object.keys(data);
    this.colors = numeric.rep([this.data[this.dimNames[0]].length], 0);
    this.selected = {};
}


Radviz.prototype.asFactor = function(data)
{
    var map = {},unique=[], factor = [], contUnique = 1;
    for(var i = 0; i < data.length; i++)
    {
        if (!map[data[i]])
        {
            map[data[i]] = contUnique;
            factor.push(contUnique);
            unique.push(data[i]);
            contUnique++;
        }else{
            factor.push(map[data[i]]);
        }
    }
    return {mapElements: map, factor: factor};
};

Radviz.prototype.setSelected = function (selection) {
    this.selected = [];
    var _this = this;
    $("#selectionList").html('');
    for (var id in selection){
        this.selected[selection[id]] = true;
        $("#selectionList").append("<option value='" + selection[id] + "'>" + selection[id] + ": " + this.data[this.dimNames[parseInt($("#listDimension").val())]][selection[id]] + "</option>");
    }
};

Radviz.prototype.setColorsColumnId = function (columnId) {
    if (isNaN(this.data[this.dimNames[columnId]][0])){
        this.isContinuous = false;
        var factor = this.asFactor(this.data[this.dimNames[columnId]]);
        this.colors = factor.factor;
    }else{
        this.isContinuous = true;
        this.colors = this.data[this.dimNames[columnId]];
    }
};

Radviz.prototype.setData = function(data){
    this.data = data;
    for (var c in this.data){
        var i;
        if (!isNaN(this.data[c][0])) {
            var min = this.data[c][0];
            var max = this.data[c][0];
            for (i = 0; i < this.data[c].length; i++) {
                if (this.data[c][i] < min) {
                    min = this.data[c][i];
                } else if (this.data[c][i] > max) {
                    max = this.data[c][i];
                }
            }
            for (i = 0; i < this.data[c].length; i++) {
                this.data[c][i] = (this.data[c][i] - min) / (max - min);
            }
        }
    }
};

Radviz.prototype.sigmoid = function(x){
    //sigmoid = 1/(1+exp(-x)) //image == [0,1]
    //sigmoid compressed [-1/2,1/2] = 1/(1+exp(-10x))
    //sigmoid compressed translated [0, 1] = 1/(1+exp(-10*x + 5))
    var scale = 10;
    var translate = -0.5;
    return (1/(1+Math.exp(-(scale*(x + translate)))));
    //return (1/(1+Math.exp(-10*x+5))); //D = [0,1] Im = [0,1]
};

Radviz.prototype.compute_yi = function(){
    this.yi = []; //used in computeProjection method. Only needs to be updated when data changes
    var _this = this;
    this.matrix.forEach(function (x){

        //_this.yi.push(aux_yi);
        var aux_yi = 0;
        for (var j = 0; j < x.length; j++){
            aux_yi += x[j] * (1 + _this.weights[j]* _this.sigmoid(x[j]));
        }
        if (aux_yi == 0) aux_yi = 1;
        _this.yi.push(aux_yi);
    });
};

Radviz.prototype.setAnchors = function(anchors) {
    //compute matrix data again, from data and columns
    var colNames = [];
    this.anchorAngles = [];
    var _this = this;
    this.weights = [];
    var groupColumns = [];
	var colMatrix = 0;
    anchors.forEach(function(a){
        if (!a.available) {
            colNames.push(a.attribute);
            _this.anchorAngles.push((a.pos*Math.PI*2)/360); //converts from degree (D3) to radians (js math)
            _this.weights.push(a.weight -1);
            if (!groupColumns[a.group]){
                groupColumns[a.group] = []
            }
            groupColumns[a.group].push(colMatrix); // column in which dimension will be added.
			colMatrix++;
        }
    });
    this.selectColumns(colNames, groupColumns);
    this.compute_yi();
};


Radviz.prototype.updateAnchors = function(anchors) {
    this.anchorAngles = [];
    this.weights = [];
    var _this = this;
    anchors.forEach(function(a){
        if (!a.available) {
            _this.anchorAngles.push((a.pos*Math.PI*2)/360); //converts from degree (D3) to radians (js math)
            if (isNaN(a.weight)){
                _this.weights.push(0);
            }else{
                _this.weights.push(a.weight-1);
            }
        }
    });
    this.compute_yi();
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
        return ([]);
    }
    var anchors = this.anglesToXY();
    var nrow = this.matrix.length;
    var ncol = this.matrix[0].length;
    var proj = [];
    for (var i = 0; i < nrow; i++) {
        var _x = 0, _y = 0;
        var matrix_i = this.matrix[i];
        for (var j = 0; j < ncol; j++) {
            _x += anchors[j][0] * matrix_i[j] * (1 + this.weights[j] * this.sigmoid(matrix_i[j]));
            _y += anchors[j][1] * matrix_i[j] * (1 + this.weights[j] * this.sigmoid(matrix_i[j]));
        }
        _x = _x / this.yi[i];
        _y = _y / this.yi[i];
        //var colorValue = FLOAT [0,1] SE ATTR COLOR NORMALIZADO / INT [0,N-1] SE NotNumber
        if (this.tooltip) {
            proj.push({x: _x, y: _y, tip: this.tooltip[i],color: this.colors[i],selected: (this.selected[i]?true:false)});
        } else {
            proj.push({x: _x, y: _y, tip: null, color: this.colors[i],selected: (this.selected[i]?true:false)});
        }
    }
    return (proj)
};//end - function computeProjection

Radviz.prototype.selectColumns = function(columns, groupColumns) {
    this.mat_t = [];
    if (columns.length == 0){
        this.mat_t = [[]];
        this.matrix = [[]];
        return;
    }

    var _this = this;
    columns.forEach(function (c) {
        //add data to matrix
        _this.mat_t.push(_this.data[c]);
    });
    this.matrix = numeric.transpose(_this.mat_t);
    this.normalizeGroups(groupColumns);
};


Radviz.prototype.normalizeGroups = function(groupColumns){
    for (var gId in groupColumns){
        var group = groupColumns[gId];

        if (group && group.length > 0) {
            var maxRows = this.mat_t[group[0]].slice(0);
            for (var dId in group) { //dimension ID
                var column = group[dId];
                for (var rId in this.mat_t[dId]) { //row id
                    if (this.mat_t[column][rId] > maxRows[rId]) {
                        maxRows[rId] = this.mat_t[column][rId];
                    }
                }
            }
            for (var i = 0; i < this.matrix.length; i++) {
                if (maxRows[i] > 0) {
                    for (var j = 0; j < group.length; j++) {
                        this.matrix[i][group[j]] = this.matrix[i][group[j]] / maxRows[i];
                    }
                }
            }
        }

    }
};

Radviz.prototype.getDimensionNames = function () {
    return Object.keys(this.data);
};