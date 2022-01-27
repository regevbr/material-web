/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { List } from './list';
import {ARIARole} from '../../types/aria';

/** @soyCompatible */
export class OptionList extends List {
  /** @soyTemplate */
  protected override getAriaRole(): ARIARole {
    return "listbox";
  }
}
