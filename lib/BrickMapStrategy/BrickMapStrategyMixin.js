const BrickMapStrategyMixin = {
    brickMapController: null,
    anchoringEventListener: null,
    conflictResolutionFunction: null,
    decisionFunction: null,
    signingFunction: null,
    cache: null,
    lastHashLink: null,
    validator: null,
    delay: null,
    anchoringTimeout: null,

    initialize: function (options) {
        if (typeof options.anchoringEventListener === 'function') {
            this.setAnchoringEventListener(options.anchoringEventListener);
        }

        if (typeof options.decisionFn === 'function') {
            this.setDecisionFunction(options.decisionFn);
        }

        if (typeof options.conflictResolutionFn === 'function') {
            this.setConflictResolutionFunction(options.conflictResolutionFn);
        }

        if (typeof options.signingFn === 'function') {
            this.setSigningFunction(options.signingFn);
        }

        if (typeof options.delay !== 'undefined' ) {
            if (!this.anchoringEventListener) {
                throw new Error("An anchoring event listener is required when choosing to delay anchoring");
            }
            this.delay = options.delay;
        }
    },

    /**
     * @param {BrickMapController} controller
     */
    setBrickMapController: function (controller) {
        this.brickMapController = controller;
    },

    /**
     * @param {callback} callback
     */
    setConflictResolutionFunction: function (fn) {
        this.conflictResolutionFunction = fn;
    },

    /**
     *
     * @param {callback} listener
     */
    setAnchoringEventListener: function (listener) {
        this.anchoringEventListener = listener;
    },

    /**
     * @param {callback} fn 
     */
    setSigningFunction: function (fn) {
        this.signingFunction = fn;
    },

    /**
     * @param {callback} fn 
     */
    setDecisionFunction: function (fn) {
        this.decisionFunction = fn;
    },

    /**
     * @return {function}
     */
    getDecisionFunction: function () {
        return this.decisionFunction;
    },

    /**
     * @param {object} validator 
     */
    setValidator: function (validator) {
        this.validator = validator;
    },

    /**
     * @param {psk-cache.Cache} cache 
     */
    setCache: function (cache) {
        this.cache = cache;
    },

    /**
     * @param {string} key 
     * @return {boolean}
     */
    hasInCache: function (key) {
        if (!this.cache) {
            return false;
        }

        return this.cache.has(key);
    },

    /**
     * @param {string} key 
     * @return {*}
     */
    getFromCache: function (key) {
        if (!this.cache) {
            return;
        }

        return this.cache.get(key);
    },

    /**
     * @param {string} key 
     * @param {*} value 
     */
    storeInCache: function (key, value) {
        if (!this.cache) {
            return;
        }

        this.cache.set(key, value)
    },

    /**
     *
     * @param {BrickMap} brickMap
     * @param {callback} callback
     */
    ifChangesShouldBeAnchored: function (brickMap, callback) {
        if (typeof this.decisionFunction === 'function') {
            return this.decisionFunction(brickMap, callback);
        }

        if (this.delay !== null) {
            clearTimeout(this.anchoringTimeout);
            this.anchoringTimeout = setTimeout(() => {
                const anchoringEventListener = this.getAnchoringEventListener(function(){console.log("Anchoring...")});
                this.brickMapController.anchorChanges(anchoringEventListener);
            }, this.delay);
            return callback(undefined, false);
        }
        return callback(undefined, true);
    },

    /**
     * @return {string|null}
     */
    getLastHashLink: function () {
        return this.lastHashLink;
    },

    afterBrickMapAnchoring: function (diff, diffHash, callback) {
        throw new Error('Unimplemented');
    },

    load: function (alias, callback) {
        throw new Error('Unimplemented');
    },

    /**
     * @param {callback} defaultListener
     * @return {callback}
     */
    getAnchoringEventListener: function (defaultListener) {
        let anchoringEventListener = this.anchoringEventListener;
        if (typeof anchoringEventListener !== 'function') {
            anchoringEventListener = defaultListener;
        }

        return anchoringEventListener;
    }
}

module.exports = BrickMapStrategyMixin;
