/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of `new.target` to look up the custom
 * element definition for the currently called constructor. `new.target` is only
 * set when `new` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
 * when extending other ES5-style classes, and does not propagate `new.target`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * `customElements.define()` and `customElements.get()` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * `browserConstruction` and `userConstruction` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
eval("(()=>{const a=window.HTMLElement,b=window.customElements.define,c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){const a=d.get(this.constructor),b=c.call(window.customElements,a);g=!0;const e=new b;return e}f=!1},window.HTMLElement.prototype=a.prototype,window.customElements.define=((c,h)=>{const i=h.prototype,j=class extends a{constructor(){super(),Object.setPrototypeOf(this,i),g||(f=!0,h.call(this)),g=!1}},k=j.prototype;j.observedAttributes=h.observedAttributes,k.connectedCallback=i.connectedCallback,k.disconnectedCallback=i.disconnectedCallback,k.attributeChangedCallback=i.attributeChangedCallback,k.adoptedCallback=i.adoptedCallback,d.set(h,c),e.set(c,h),b.call(window.customElements,c,j)}),window.customElements.get=(a=>e.get(a))})();");
