/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {TextField} from './text-field';

/** @soyCompatible */
export abstract class FilledTextField extends TextField {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-text-field--filled': true,
    };
  }
}
