'use strict'

var extract = require('./extract')

var blockInfo // code, line, indent

var tagProcessor = {
  preprocess: function(content) {
    blockInfo = extract(content)
    return [blockInfo.code]
  },

  postprocess: function(messages, filename) {
    messages[0].forEach(function(message) {
      var origLines = message.line;
      message.line += (blockInfo.line - 1)
      if (message.fix) {
        message.fix.range[0] += blockInfo.codeStartIndex;
        message.fix.range[1] += blockInfo.codeStartIndex;
      }
    })
    return messages[0]
  },

  supportsAutofix: true
}

module.exports = {
  processors: {
    '.html': tagProcessor,
    '.tag': tagProcessor
  }
}
