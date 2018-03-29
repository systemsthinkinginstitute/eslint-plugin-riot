'use strict'

var htmlparser = require('htmlparser2')

function extract(code) {

  var scriptCode = ''
  var tagStartLineNum = 0
  var finished = false
  var inScript = false
  var codeStartIndex

  var parser = new htmlparser.Parser({

    onopentag: function(name, attrs) {
      // test if current tag is a valid <script> tag.
      if (name !== 'script') {
        return
      }

      // test if current type is javascript
      if (attrs.type && ['es6', 'babel', 'javascript'].indexOf(attrs.type.toLowerCase().replace('text/', '')) < 0) {
        return
      }

      if (finished) {
        return
      }

      inScript = true

      tagStartLineNum = code.slice(0, parser.endIndex).match(/\r\n|\n|\r/g).length + 1
    },

    onclosetag: function(name) {
      if (name !== 'script' || !inScript) {
        return
      }
      inScript = false
      finished = true
    },

    ontext: function(data) {
      if (!inScript) {
        return
      }
      
      if (!codeStartIndex) {
        codeStartIndex = parser.startIndex;
      }

      scriptCode += data
    }

  })

  parser.parseComplete(code)

  // trim the last line's ending spaces
  scriptCode = scriptCode.replace(/[ \t]*$/, '')
  return { code: scriptCode, line: tagStartLineNum, codeStartIndex: codeStartIndex }
}

module.exports = extract
