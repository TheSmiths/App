/**
 * lib.controller
 */
var Alloy = require('alloy'),
    _ = Alloy._;

var log = require('utils/log');

module.exports = {
    /**
     * Extend Alloy's createController and createWidget functions to:
     * - call construct function when controller is initialized.
     * - destruct when Window of controller is closed.
     *
     */
    extendAlloy: function() {
        // Wrap some Alloy functions, so they call construct and destruct methods.
        var _alloy_createController = Alloy.createController,
            _alloy_createWidget = Alloy.createWidget;

        /**
         *
         *
         * @param {Alloy.Controller} controller Controller to add the functions to
         */
        var extendController = function(controller, config) {
            // Only add eventlistener on top level View if View is a Ti.UI.Window
            if(controller.getView() && controller.getView().apiName == 'Ti.UI.Window') {
                /**
                 * Handle `close` event of Window.
                 *
                 * Removes eventlistener and calls both destruct as Alloy's generated destroy functions.
                 *
                 * @private
                 * @param {Object} evt Event details
                 */
                var onCloseWin = function(evt) {
                    // Remove eventListener
                    controller.getView().removeEventListener('close', onCloseWin);

                    // Call desruct()
                    if (controller.destruct && _.isFunction(controller.destruct)) {
                        log.info('destruct() called on ' + (controller.getView() && controller.getView().id));
                        controller.destruct.call(controller, evt);
                    } else
                        log.warn('destruct() NOT called');

                    // Call Alloy's generated destroy method
                    controller.destroy.call(controller, evt);
                };

                // Call onCloseWin when window closes
                controller.getView().addEventListener('close', onCloseWin);
            }
            // Call constructor, if exists
            if (controller.construct && _.isFunction(controller.construct)) {
                controller.construct.call(controller, config || {});
            }
        };

        /**
         * Call original Alloy.createController function and then construct if it exists.
         *
         * @param  {String} name Controller name
         * @param  {Object} [config] Controller configuration
         *
         * @return {Alloy.controller} Created controller
         */
        Alloy.createController = function(name, config) {
            // Create controller using Alloy's original function
            var controller = _alloy_createController(name, config);

            // Extent controller
            extendController(controller, config);

            return controller;
        };

        /**
         * Call original Alloy.createWidget function and then construct if it exists.
         *
         * @param  {String} name Widget name to create
         * @param  {String} [controller] Controller name to create inside created Widget
         * @param  {Object} [config] Controller configuration
         *
         * @return {Alloy.controller} Created controller, extended with RebelFrame fucntions
         */
        Alloy.createWidget = function(name, controller, config) {
            // Create controller using Alloy's original function
            var widget = _alloy_createWidget(name, controller, config);

            // Also support `name, config` as arguments, instead of `name, controller, config`, but do this only after calling the original method.
            // Copied from Alloy.js' definition
            if ("undefined" != typeof controller && null !== controller && _.isObject(controller) && !_.isString(controller)) {
                config = controller;
            }

            // Extent controller
            extendController(widget, config);

            return widget;
        };
    }
};
