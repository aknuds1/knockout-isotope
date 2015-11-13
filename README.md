# Knockout-Isotope

*Knockout-Isotope is currently unmaintained, as I haven't used Knockout for a long time.*

Isotope binding for Knockout. Visit the [project home page](http://aknuds1.github.io/knockout-isotope/)
to find builds (including the required version of Knockout) of the code.

## Description

This binding makes it possible to visualize a Knockout observableArray through
the excellent [Isotope](https://github.com/desandro/isotope) jQuery plugin. See
demo.html for a demonstration of the binding's functionality.

## Requirements

Knockout-Isotope requires [Isotope](https://github.com/desandro/isotope) and a
modified version of [Knockout](https://github.com/aknuds1/knockout).
Knockout had to be modified in order to notify bindings of new elements before
they're added to the DOM.

## Installation

Download lib/knockout-isotope.min.js (or knockout-isotope.js for development) 
and include it in your project after Knockout and Isotope.

## Usage

In your HTML, refer to the 'isotope' Knockout binding for the element intended
to serve as the container for your Isotope elements, for example:

```html
<html>
  <head>
    <script type="text/javascript" src="spec/lib/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="spec/lib/knockout-2.2.2.debug.js"></script>
    <script type="text/javascript" src="spec/lib/jquery.isotope.js"></script>
    <script type="text/javascript" src="lib/knockout-isotope.js"></script>

    <script type="text/javascript">
      $(document).ready(function () {
          function ViewModel() {
            this.items = ko.observableArray(["Item 1", "Item 2"]);
          }

          ko.applyBindings(new ViewModel());
      });
    </script>
  </head>
  <body>
    <div id="container" data-bind="isotope: items">
      <div data-bind="text: $data"></div>
    </div>
  </body>
</html>
```

## Options
Knockout-Isotope also supports certain options, perhaps most importantly
allowing you to specifying options to Isotope, e.g. to control the layout mode.

The options are:

* itemClass

  Specify the class that Isotope elements should be adorned with
  (Knockout-Isotope does this automatically).
* filterClass

  Specify the class that should be control whether Isotope elements are
  displayed or not (Knockout-Isotope applies this class automatically).
* isotopeOptions

  This should be a callback on the view model that returns an object
  containing options for initializing Isotope. See [Isotope's documentation](http://isotope.metafizzy.co/docs/options.html) 
  for information on supported options. An options object can for instance look
  like this: `{ layoutMode: 'masonry' }`

### Example of Passing Options to Knockout-Isotope

```html
...
<script type="text/javascript">
  $(document).ready(function () {
      function ViewModel() {
        this.items = ko.observableArray(["Item 1", "Item 2"]);
        this.getOptions = function () {
          return { layoutMode: 'masonry' };
        };
      }

      ko.applyBindings(new ViewModel());
  });
</script>
...
<div id="container" data-bind="isotope: {data: items, itemClass: 'item', filterClass: 'show', isotopeOptions: getOptions}">
  <div data-bind="text: $data"></div>
</div>
...
```

## Testing

Knockout-Isotope is tested through Jasmine specifications, contained in
'spec/isotopeBinding.js'. In order to run them, open 'spec/runner.html' in a
browser.

## Downloads

Downloads for Knockout-Isotope (including required Knockout version) are available at [Google Drive](https://drive.google.com/folderview?id=0B-CYTCgIOsvrQ2EwaHVBdGZGY0k&usp=sharing).

<!-- vim: set ff=unix sts=4 sw=4 et: -->
