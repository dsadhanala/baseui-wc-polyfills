import { expect } from 'chai';
import {
    isTemplateNative,
    isCustomElementsNative,
    isFetchNative,
    isCustomEventNative,
    isShadowDOMNative
} from '../feature-detection/index';
import { ready } from '../index';

describe('BaseUI WebComponents polyfills tests:', () => {
    it('should return empty polyfills list, when all features are native and no params', async () => {
        const allNative = isCustomElementsNative()
            && isShadowDOMNative()
            && (isFetchNative() || isCustomEventNative() || isTemplateNative());
        if (!allNative) return;

        const actual = await ready();
        expect(actual).to.have.lengthOf(0);
    });

    it('should return empty polyfills list, when all features are set to false', async () => {
        const actual = await ready({ wcPlatform: false, shadowDOM: false, customElements: false });
        expect(actual).to.have.lengthOf(0);
    });

    it("should return shadowDOM polyfill, when it's not native", async () => {
        if (isShadowDOMNative()) {
            const actual = await ready({ customElements: false });
            expect(actual).to.have.lengthOf(0);
            return;
        }

        const actual = await ready({ customElements: false });
        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('shadow-dom');

        // when set to false it should not load
        const disableLoading = await ready({ customElements: false, shadowDOM: false });
        expect(disableLoading).to.have.lengthOf(0);
    });

    it("should return customElements polyfill, when it's not native", async () => {
        if (isCustomElementsNative()) {
            const actual = await ready({ shadowDOM: false });
            expect(actual).to.have.lengthOf(0);
            return;
        }

        const actual = await ready({ shadowDOM: false });
        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('custom-elements');

        // when set to false it should not load
        const disableLoading = await ready({ shadowDOM: false, customElements: false });
        expect(disableLoading).to.have.lengthOf(0);
    });

    it("should return wc-platform polyfills, when it's not native", async () => {
        const actual = await ready({ shadowDOM: false, customElements: false });
        if (isFetchNative() || isCustomEventNative() || isTemplateNative()) {
            expect(actual).to.have.lengthOf(0);
            return;
        }

        expect(actual).to.have.lengthOf(1);
        expect(actual[0]).to.be.equal('wc-platform-polyfills');

        // when set to false it should not load
        const disableLoading = await ready({ wcPlatform: false });
        expect(disableLoading).to.have.lengthOf(0);
    });
});
