import { APP_BASE_HREF, HashLocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

@Injectable()
export class HashPreserveQueryLocationStrategy extends HashLocationStrategy {
    private readonly initialQueryParam: string;

    constructor(
        _platformLocation: PlatformLocation,
        @Optional() @Inject(APP_BASE_HREF) _baseHref?: string
    ) {
        super(_platformLocation, _baseHref);
        this.initialQueryParam = window.location.search || '';
    }
    
    override prepareExternalUrl(internal: string): string {
        const hash = super.prepareExternalUrl(internal);
        return this.initialQueryParam + hash;
    }
}