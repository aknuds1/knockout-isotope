"use strict";

describe('Binding: Isotope', function () {
    var binding, element, $testNode, isotope, viewModel,
        $children;

    // Set up new DOM node to execute code against
    function prepareTestNode() {
        var $existingNode = $('#test-node');
        if ($existingNode.length > 0) {
            $existingNode.remove();
        }
        $testNode = $('<div id="test-node" data-bind="isotope: items"><div class="item" data-bind="text: $data"></div></div>');
        $('body').append($testNode);

        viewModel = { items: ko.observableArray([1, 2]) };
    };

    beforeEach(function () {
        prepareTestNode();
        element = $testNode[0];
        binding = ko.bindingHandlers.isotope;
        
        isotope = jasmine.createSpy('isotope').andCallFake(function () {
            $children = $testNode.children();
        });
        $.fn.isotope = isotope;
    });

    it('observes an observableArray', function () {
        var values = ko.observableArray([]);
        expect(function () {
            binding.init(element, function () {return values;});
                }).not.toThrow();
    });

    it('observes a regular array', function () {
        expect(function () {
            binding.init(element, function () { return []; });
                }).not.toThrow();
    });

    it('does not accept a null observable', function () {
        expect(function () {
            binding.init(element, function () {return null;});
                }).toThrow();
    });

    it('does not accept an undefined observable', function () {
        expect(function () {
            binding.init(element, function () {return undefined;});
                }).toThrow();
    });

    it('does not accept a scalar', function () {
        expect(function () {
            binding.init(element, function () { return 1; });
                }).toThrow();
    });

    it('does not accept a scalar observable', function () {
        expect(function () {
            binding.init(element, function () { return ko.observable(); });
                }).toThrow();
    });

    it('initializes isotope after adding child elements', function () {
        var $children, i;
        ko.applyBindings(viewModel);

        $children = $testNode.children();
        expect($children.length).toEqual(viewModel.items().length);
        for (i in viewModel.items) {
            expect($children[i].text()).toEqual(viewModel.items[i]);
        }

        expect(isotope).toHaveBeenCalledWith({
            itemSelector: '.item',
            layoutMode: 'cellsByRow'
        });
        expect(isotope.calls.length).toEqual(1);
        expect(isotope.mostRecentCall.object[0]).toEqual($testNode[0]);

        expect(children);
    });
});

(function () {
    var env = jasmine.getEnv();
    env.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    env.addReporter(htmlReporter);
    env.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var curWindowOnLoad = window.onload;
    window.onload = function () {
        if (curWindowOnLoad) {
            curWindowOnLoad();
        }

        //document.querySelector('.version').innerHTML = env.versionString();
        env.execute();
    };
})();
