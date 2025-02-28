/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {IconButton} from './icon-button';

// Note that we cast `linkTarget` to this type, below. The Lit compiler
// enforces the `target` attribute value to be of this type, but this is not
// compatible with the generated Wit Soy/JS, which expects `linkTarget`
// to be a string type.
type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

/** @soyCompatible */
export class LinkIconButton extends IconButton {
  @property({type: String}) linkHref = '';

  @property({type: String}) linkTarget!: string;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<div
        class="md3-icon-button"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @clickmod="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}"
    >${this.renderRipple()}
    ${this.renderIcon(this.icon)}${
        this.renderTouchTarget()}<span><slot></slot></span>
    <a class="md3-icon-button__link" href="${this.linkHref}"
        target="${ifDefined(this.linkTarget as LinkTarget)}" aria-label="${
        ifDefined(this.ariaLabel)}"></a>
  </div>`;
  }
}
