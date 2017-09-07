import {
    isTemplateNative,
    isCustomElementsNative,
    isFetchNative,
    isCustomEventNative,
    isShadowDOMNative
} from '../feature-detection/index';
import { ready } from '../index';

describe('BaseUI WebComponents polyfills tests:', () => {
    it('should return `empty` polyfills list, when all features are set to false', async () => {
        const allDisabled = { builtInClassShim: false, wcPlatform: false, shadowDOM: false, customElements: false };

        const actual = await ready(allDisabled);
        expect(actual).to.have.lengthOf(0);
    });

    it('should load `built-in-class-shim`, when `customElements` is native fature', async () => {
        const disableRest = { wcPlatform: false, shadowDOM: false };
        if (!isCustomElementsNative()) return;

        const actual = await ready(disableRest);
        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('built-in-class-shim');
    });

    it('should load `customElements` polyfill, when it is not native fature', async () => {
        const disableRest = { builtInClassShim: false, wcPlatform: false, shadowDOM: false };
        if (isCustomElementsNative()) return;

        const actual = await ready(disableRest);
        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('custom-elements');
    });

    it('should load `shadowDOM` polyfill, when it is not native fature', async () => {
        const disableRest = { builtInClassShim: false, wcPlatform: false, customElements: false };

        if (isShadowDOMNative()) {
            const actual = await ready(disableRest);
            expect(actual).to.have.lengthOf(0);
            return;
        }

        const actual = await ready(disableRest);
        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('shadow-dom');
    });

    it('should load `wc-platform polyfills`, when WC dependencies are not native features', async () => {
        const disableRest = { builtInClassShim: false, shadowDOM: false, customElements: false };

        if (!isCustomEventNative() || !isFetchNative() || !isTemplateNative()) {
            const actual = await ready(disableRest);
            expect(actual).to.have.lengthOf(1);
            expect(actual[0]).to.be.equal('wc-platform-polyfills');
            return;
        }

        const actual = await ready(disableRest);
        expect(actual).to.have.lengthOf(0);
    });
});
