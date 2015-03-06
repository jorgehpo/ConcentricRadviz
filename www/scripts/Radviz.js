function Radviz(){

}

Radviz.prototype.normalizeData = function(m) {
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