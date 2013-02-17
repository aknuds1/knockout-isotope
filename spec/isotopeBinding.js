"use strict";

_.mixin(_.string.exports());

describe('Knockout-Isotope', function () {
    var binding, element, $testNode, isotope, viewModel,
        $children;

    // Set up new DOM node to execute code against
    function prepareTestNode() {
        var $existingNode = $('#test-node');
        if ($existingNode.length > 0) {
            $existingNode.remove();
        }
        $testNode = $('<div id="test-node" style="display: none" data-bind="isotope: items"><div data-bind="text: $data"></div></div>');
        $('body').append($testNode);
    };

    function applyBindings() {
        ko.applyBindings(viewModel, $testNode[0]);
    }
        
    // Get calls to isotope spy for a method (can be undefined)
    function getIsotopeCalls(method) {
        var calls = [];
        _.each(isotope.calls, function (call, index) {
            if (call.args[0] === method) {
                calls.push({call: call, callIndex: index});
            }
        });

        return calls;
    }

    // Get default options for initializing isotope
    function getDefaultIsotopeOptions() {
        return {
            itemSelector: '.' + ko.bindingHandlers.isotope.defaultItemClass,
            filter: '.' + ko.bindingHandlers.isotope.defaultFilterClass,
            getSortData: {
                index: ko.bindingHandlers.isotope._getSortData
            },
            sortBy: 'index'
        };
    }

    beforeEach(function () {
        prepareTestNode();
        viewModel = { items: ko.observableArray([1, 2]) };
        element = $testNode[0];
        binding = ko.bindingHandlers.isotope;
        
        isotope = jasmine.createSpy('isotope').andCallFake(function () {
            expect(this[0]).toEqual($testNode[0]);
            $children = $testNode.children().clone();

            // Perform removal of elements, since this is Isotope's responsibility
            if (arguments[0] === 'remove') {
                // The second argument should be a jQuery selector of elements
                // to remove
                arguments[1].remove();
            }
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

    it('accepts a null observable', function () {
        expect(function () {
            binding.init(element, function () {return null;});
                }).not.toThrow();
    });

    it('accepts an undefined observable', function () {
        expect(function () {
            binding.init(element, function () {return undefined;});
                }).not.toThrow();
    });

    it('accepts a scalar', function () {
        expect(function () {
            binding.init(element, function () { return 1; });
                }).not.toThrow();
    });

    it('accepts a scalar observable', function () {
        expect(function () {
            binding.init(element, function () { return ko.observable(); });
                }).not.toThrow();
    });

    it('expects at least one template element', function () {
        $testNode.children().remove();
        expect(function () {
            applyBindings();
        }).toThrow();
    });

    it('expects no more than one template element', function () {
        $testNode.append($('<div></div>'));
        expect(function () {
            applyBindings();
        }).toThrow();
    });

    it('initializes isotope after child elements are instantiated', function () {
        applyBindings();

        expect($children.length).toEqual(viewModel.items().length);
        for (var i in viewModel.items()) {
            var $child = $($children[i]);
            var item = viewModel.items()[i].toString();
            expect($child.text()).toEqual(item);
        }

        expect(isotope).toHaveBeenCalledWith(getDefaultIsotopeOptions());
        expect(isotope.calls.length).toEqual(1);
    });

    it('registers added elements with isotope', function () {
        var addItemsCalls, addItemsCall, value = 3;
        applyBindings();
        viewModel.items.unshift(value);

        addItemsCalls = getIsotopeCalls('addItems');
        // There should be one call to addItems
        expect(addItemsCalls.length).toEqual(1);
        addItemsCall = addItemsCalls[0];
        expect(addItemsCall.call.args[1].text()).toEqual(value.toString());
        // And then a no-arguments call, to perform element filtering
        expect(isotope.calls[addItemsCall.callIndex+1].args.length).toEqual(0);
    });

    it('deletes elements through isotope', function () {
        var removeCalls, removeCall, domValues, itemValues;
        applyBindings();
        viewModel.items.shift();

        removeCalls = getIsotopeCalls('remove');
        expect(removeCalls.length).toEqual(1);
        domValues = _.map($testNode.children(), function (elem) {
            return $(elem).text();
        });
        itemValues = _.map(viewModel.items(), function (item) {
            return item.toString();
        });
        expect(domValues).toEqual(itemValues);
    });

    it('supports parameters to isotope', function () {
        var clientOpts = {
                layoutMode: 'cellsByRow',
                cellsByRow: {
                  columnWidth: 220,
                  rowHeight: 160
                }
            }, opts;
        viewModel.getIsotopeOptions = function () {
            return clientOpts;
        };
        $testNode.attr('data-bind', 'isotope: { data: items, options: getIsotopeOptions }');
        applyBindings();

        opts = getDefaultIsotopeOptions();
        ko.utils.extend(opts, clientOpts);
        expect(isotope).toHaveBeenCalledWith(opts);
    });

    it('does not override vital parameters to isotope', function () {
        var clientOpts = {
                layoutMode: 'cellsByRow',
                cellsByRow: {
                  columnWidth: 220,
                  rowHeight: 160
                },
                filter: '.filter',
                itemSelector: '.item',
                getSortData: {},
                sortBy: 'myIndex'
            }, opts;
        viewModel.getIsotopeOptions = function () {
            return clientOpts;
        };
        $testNode.attr('data-bind', 'isotope: { data: items, options: getIsotopeOptions }');
        applyBindings();

        opts = getDefaultIsotopeOptions();
        _.each(clientOpts, function (value, key) {
            if (key !== 'filter' && key !== 'itemSelector' && key !== 'getSortData' && key !== 'sortBy') {
                opts[key] = value;
            }
        });
        expect(isotope).toHaveBeenCalledWith(opts);
    });

    it('parameterizes item class and filter class', function () {
        var itemClass = 'item', filterClass = 'filter', bind =
            _.sprintf('isotope: { data: items, itemClass: \'%s\', filterClass: \'%s\' }',
                itemClass, filterClass), opts;
        $testNode.attr('data-bind', bind);
        applyBindings();

        expect($testNode.children().hasClass(itemClass)).toBe(true);
        expect($testNode.children().hasClass(filterClass)).toBe(true);
        opts = getDefaultIsotopeOptions();
        opts.itemSelector = '.' + itemClass;
        opts.filter = '.' + filterClass;
        expect(isotope).toHaveBeenCalledWith(opts);
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
