(function customEventPloyfill() {
    function CustomEvent(event, params) {
        const parmsObj = {
            bubbles   : false,
            cancelable: false,
            detail    : undefined
        };

        const evt = document.createEvent('CustomEvent');

        const hasParams = params || parmsObj;
        evt.initCustomEvent(event, hasParams.bubbles, hasParams.cancelable, hasParams.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent    = CustomEvent;
}());
