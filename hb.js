define(["text", "handlebars"], function(text, bars) {
  var loaded = {}
  return {
    load: function (name, req, onLoad, config) {
      loaded[name] = []
      text.load(name, req, function(text) {
        templates = {}
        scriptsById(text).forEach(function(script) {
          var id = script.id
          loaded[name].push({id: id, content: script.content})
          if (!config.isBuild) {
            bars.registerPartial(script.id, script.content)
            templates[id] = bars.compile(script.content);
          }
        })
        onLoad(templates)
      }, config)
    },
    write: function (pluginName, moduleName, write, config) {
      console.log("hb.js Writing module " + moduleName)

      var templateScript = "var templates = {};\n"

      loaded[moduleName].forEach(function(script) {
        console.log("hb.js writing template " + script.id)
        var precompiled = bars.precompile(script.content)

        templateScript += "var t = Handlebars.template(" + precompiled + ");\n" +
                          "Handlebars.registerPartial('" + script.id.replace(/\//g, '_') + "', t);\n" +
                          "templates['" + script.id + "']=t;\n"
      })

      templateScript += "return templates;\n"

      var fullJs = "define(['handlebars'], function( Handlebars ){ \n" +
        templateScript+"return t;\n" +
        "});\n";
      write.asModule(pluginName + "!" + moduleName, fullJs);
    }
  }

  function scriptsById(html) {
    var match = html.match(/.*<script.*id.*>/)
    if (match) {
      var tag = match[0];
      var id = tag.match(/id="([^"]*)"/)[1]
      var pos = match.index + tag.length
      return parseContentAndMore(id, html.substring(pos))
    } else {
      return []
    }
  }

  function parseContentAndMore(id, html) {
    var tag = "<\/script>";
    var index = html.indexOf(tag)
    var content = html.substring(0, index).trim()
    var rest = html.substring(index + tag.length)
    return [{ id: id, content: content}].concat(scriptsById(rest))
  }
})
