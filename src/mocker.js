module.exports.defaults = {
  errorRate : .2
}

module.exports.init = function(options) {
  this.errorRate = (options && options.errorRate) || module.exports.defaults.errorRate;
}

module.exports.heart = function() {
  return { value : '', code: 204};
}
