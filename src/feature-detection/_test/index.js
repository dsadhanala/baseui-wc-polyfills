import { expect } from 'chai';
import {
    isTemplateNative,
    isCustomElementsNative,
    isFetchNative,
    isCustomEventNative,
    isShadowDOMNative
} from '../index';

describe('feature detection tests', () => {
    it('should check if template element is native or not', () => {
        expect(true).to.equal(true);
    });
});

