/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, PropertyValues, TemplateResult} from 'lit';
import {state} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';
import {styleMap} from 'lit/directives/style-map';

import {Field} from './field';

/** @soyCompatible */
export class FilledField extends Field {
  @state() protected strokeTransformOrigin = '';

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-field--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderContainer(): TemplateResult {
    return html`
      <span class="md3-field__container" @click=${this.handleClick}>
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected override renderContainerContents(): TemplateResult {
    /** @styleMap */
    const strokeStyle = {transformOrigin: this.strokeTransformOrigin};
    return html`
      <span class="md3-field__state-layer"></span>
      ${super.renderContainerContents()}
      <span class="md3-field__active-indicator"
        style="${styleMap(strokeStyle)}"></span>
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderFloatingLabel()}
      ${this.renderRestingLabel()}
      ${super.renderMiddleContents()}
    `;
  }

  protected handleClick(event: MouseEvent|TouchEvent) {
    if (this.disabled) {
      return;
    }

    this.updateStrokeTransformOrigin(event);
  }

  protected override willUpdate(props: PropertyValues<this>) {
    super.update(props);

    // Upon losing focus, the stroke resets to expanding from the center, such
    // as when re-focusing with a keyboard.
    if (props.has('focused') && !this.focused) {
      this.updateStrokeTransformOrigin();
    }
  }

  protected async updateStrokeTransformOrigin(event?: MouseEvent|TouchEvent) {
    let transformOrigin = '';
    if (event) {
      // Can't use instanceof TouchEvent since Firefox does not provide the
      // constructor globally.
      const isTouchEvent = 'touches' in event;
      const eventX = isTouchEvent ? event.touches[0].clientX : event.clientX;
      const rootRect = this.getBoundingClientRect();
      transformOrigin = `${eventX - rootRect.x}px`;
    }

    this.strokeTransformOrigin = transformOrigin;
  }
}
