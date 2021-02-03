let idx = 1;

exports.getIdx = function() {
  return idx;
}

exports.incIdx = function() {
  idx++;
}

exports.decIdx = function() {
  idx--;
}

exports.setIdx = function(val) {
  idx = val;
}
