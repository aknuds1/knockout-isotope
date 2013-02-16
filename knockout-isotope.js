(function () {
    var filterClass = 'knockout-isotope-filter', $element, itemClass = 'knockout-isotope-item';

    function makeTemplateValueAccessor(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if (!unwrappedValue || typeof unwrappedValue.length === "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    }

    ko.bindingHandlers.isotope = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $element = $(element);
            if ($element.children().length !== 1) {
                throw new Error('The element must have *1* child, from to instantiate Isotope items');
            }
            // Adorn template with itemClass and filterClass, so that children
            // are found and displayed (not filtered) by Isotope
            $element.children()
                .addClass(itemClass)
                .addClass(filterClass);
          
            // Initialize template engine, moving child template element to an
            // "anonymous template" associated with the element
            ko.bindingHandlers.template.init(element,
                    makeTemplateValueAccessor(valueAccessor));

            // TODO: Parameterize itemClass, filterClass, layoutMode, cellsByRow
            $element.isotope({
                itemSelector: '.' + itemClass,
                filter: '.' + filterClass,
                layoutMode: 'cellsByRow',
                cellsByRow: {
                    columnWidth: 240,
                    rowHeight: 180
                }
            });

            return { controlsDescendantBindings: true };
        },
        'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.bindingHandlers.template.update(element,
                    makeTemplateValueAccessor(valueAccessor),
                    allBindingsAccessor, viewModel, bindingContext);


            // TODO: For every added element, add filterClass now
            // Sort Isotope's elements according to DOM order
            $element.isotope('reloadItems');
            $element.isotope({sortBy: 'original-order'});

            return { controlsDescendantBindings: true };
        }
    };
})();
