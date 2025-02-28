/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action_element/action-element';
import {ariaProperty} from '../../decorators/aria-property';
import {Ripple} from '../../ripple/mwc-ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';

/** @soyCompatible */
export class IconButtonToggle extends ActionElement {
  @query('.md3-icon-button') protected mdcRoot!: HTMLElement;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  // `aria-label` of the button when `on` is true.
  @property({type: String}) ariaLabelOn!: string;

  // `aria-label` of the button when `on` is false.
  @property({type: String}) ariaLabelOff!: string;

  @property({type: Boolean, reflect: true}) isOn = false;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  override beginPress({positionEvent}: BeginPressConfig) {
    this.rippleHandlers.startPress(positionEvent ?? undefined);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.rippleHandlers.endPress();
    if (cancelled) {
      return;
    }
    this.isOn = !this.isOn;
    const detail = {isOn: this.isOn};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
    super.endPress({cancelled, actionData: detail});
  }

  override click() {
    this.mdcRoot.focus();
    this.mdcRoot.click();
  }

  override focus() {
    this.rippleHandlers.startFocus();
    this.mdcRoot.focus();
  }

  override blur() {
    this.rippleHandlers.endFocus();
    this.mdcRoot.blur();
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? html`
            <md-ripple
                .disabled="${this.disabled}"
                unbounded>
            </md-ripple>` :
                                     '';
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    /** @classMap */
    const classes = {
      'md3-icon-button--on': this.isOn,
    };
    const hasToggledAriaLabel =
        this.ariaLabelOn !== undefined && this.ariaLabelOff !== undefined;
    const ariaPressedValue = hasToggledAriaLabel ? undefined : this.isOn;
    const ariaLabelValue = hasToggledAriaLabel ?
        (this.isOn ? this.ariaLabelOn : this.ariaLabelOff) :
        this.ariaLabel;
    return html`<button
          class="md3-icon-button ${classMap(classes)}"
          aria-pressed="${ifDefined(ariaPressedValue)}"
          aria-label="${ifDefined(ariaLabelValue)}"
          @click="${this.handleClick}"
          ?disabled="${this.disabled}"
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
        >${this.renderRipple()}${this.renderTouchTarget()}
        <span class="md3-icon-button__icon">
          <slot name="offIcon">${this.renderIcon(this.offIcon)}</slot>
        </span>
        <span class="md3-icon-button__icon md3-icon-button__icon--on">
          <slot name="onIcon">${this.renderIcon(this.onIcon)}</slot>
        </span>
      </button>`;
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult|string {
    // TODO(b/221096356): This method should be abstract.
    // This should be overridden by subclass to provide the appropriate
    // font icon (M3 or GM).
    return '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  protected handlePointerEnter(e: PointerEvent) {
    // TODO(b/149026822): Remove check, implement in ripple
    if (e.pointerType !== 'touch') {
      this.rippleHandlers.startHover();
    }
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.rippleHandlers.endHover();
  }

  protected handleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleBlur() {
    this.rippleHandlers.endFocus();
  }
}
