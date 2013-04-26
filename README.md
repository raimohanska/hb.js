## hb.js

The missing Handlebars plugin for require.js I want to share with U.

With tis simple plugin, U can include ur Handlebars templates using require.js. Like this:

```js
define(["hb!bacon-templates.html"], function (templates) {
  return function BaconView() {
    var element = $(templates['bacon-template']({bacon: "Delicious"}))
    $("body").append(element)
  }
})

```

So, as you might figure out, the `templates` object contains the template functions indexed by template ids.
Just access your favorite template and call it.

The plugin assumes that your template files have this kind of structure.

```html
<script id="bacon-template" type="text/html">
  <div class="bacon">{{bacon}}</div>
</script>
```

So you can put multiple templates into a single file. The plugin assumes by the way that the `<script>` and
teh `</script>` tags are on theyr own separate lines. Oh, and it assumes that there are no other script tags
in the template in addition to those that mark the start/end of individual templates.

### Deps

The plugin uses the (indluded) [text](https://github.com/requirejs/text) plugin for loading the template files, so you 
need to include it. It obviously also uses [handlebars](https://github.com/wycats/handlebars.js/). I've included the
versions of both libs that I've used in my application.

Despise me for the shameless regex-based HTML parsing, but please remember submit a PR when you're done.
