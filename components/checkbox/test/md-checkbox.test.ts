/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import * as hanbi from 'hanbi';
import {html} from 'lit';

import {fixture, rafPromise, simulateFormDataEvent, TestFixture} from '../../../../test/src/util/helpers';
import {MdCheckbox} from '../checkbox';

interface CheckboxInternals {
  formElement: HTMLInputElement;
  animationClass: string;
}

interface CheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  value: string;
  name: string;
  reduceTouchTarget: boolean;
}

const defaultCheckbox = html`<md-checkbox></md-checkbox>`;

const checkbox = (propsInit: Partial<CheckboxProps>) => {
  return html`
    <md-checkbox
      ?checked=${propsInit.checked === true}
      ?indeterminate=${propsInit.indeterminate === true}
      ?disabled=${propsInit.disabled === true}
      value=${propsInit.value ?? ''}
      ?reduceTouchTarget=${propsInit.reduceTouchTarget === true}>
    </md-checkbox>
  `;
};

const checkboxInForm = (propsInit: Partial<CheckboxProps>) => {
  return html`
      <form>
        <md-checkbox
          ?checked="${propsInit.checked === true}"
          ?disabled="${propsInit.disabled === true}"
          name="${propsInit.name ?? ''}"
          value="${propsInit.value ?? ''}">
        </md-checkbox>
      </form>
  `;
};

describe('md-checkbox', () => {
  let fixt: TestFixture;
  let element: MdCheckbox;
  let internals: CheckboxInternals;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultCheckbox);
      element = fixt.root.querySelector('md-checkbox')!;
      internals = element as unknown as CheckboxInternals;
    });

    it('initializes as an md-checkbox', () => {
      expect(element).toBeInstanceOf(MdCheckbox);
      expect(element.checked).toEqual(false);
      expect(element.indeterminate).toEqual(false);
      expect(element.disabled).toEqual(false);
      expect(element.value).toEqual('on');
    });

    it('element.formElement returns the native checkbox element', async () => {
      await element.updateComplete;
      expect(internals.formElement).toBeInstanceOf(HTMLElement);
      expect(internals.formElement.localName).toEqual('input');
    });

    it('user input updates checked state', async () => {
      element.shadowRoot!.querySelector('input')!.click();
      await element.updateComplete;
      expect(element.checked).toEqual(true);
    });

    it('change event has updated values for `checked`', () => {
      expect(element.checked).toBeFalse();
      element.shadowRoot!.querySelector('input')!.click();
      expect(element.checked).toBeTrue();
    });

    it('does not animate after being hidden', async () => {
      element.checked = true;
      const animatedElement =
          element.shadowRoot!.querySelector('.md3-checkbox__background')!;
      await new Promise((resolve) => {
        animatedElement.addEventListener('animationend', resolve);
      });
      await element.updateComplete;
      element.style.display = 'hidden';
      await rafPromise();
      element.style.display = '';
      await rafPromise();
      expect(internals.animationClass).toEqual('');
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({checked: true}));
      element = fixt.root.querySelector('md-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the checked property on the native checkbox element',
       async () => {
         expect(internals.formElement.checked).toEqual(true);
         element.checked = false;
         await element.updateComplete;
         expect(internals.formElement.checked).toEqual(false);
       });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({indeterminate: true}));
      element = fixt.root.querySelector('md-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the indeterminate property on the native checkbox element',
       async () => {
         expect(internals.formElement.indeterminate).toEqual(true);
         expect(internals.formElement.getAttribute('aria-checked'))
             .toEqual('mixed');
         element.indeterminate = false;
         await element.updateComplete;
         expect(internals.formElement.indeterminate).toEqual(false);
       });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({disabled: true}));
      element = fixt.root.querySelector('md-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the disabled property on the native checkbox element',
       async () => {
         expect(internals.formElement.disabled).toEqual(true);
         element.disabled = false;
         await element.updateComplete;
         expect(internals.formElement.disabled).toEqual(false);
       });
  });

  describe('value', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({value: 'new value'}));
      element = fixt.root.querySelector('md-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the value of the native checkbox element', async () => {
      expect(internals.formElement.value).toEqual('new value');
      element.value = 'new value 2';
      await element.updateComplete;
      expect(internals.formElement.value).toEqual('new value 2');
    });
  });

  // IE11 can only append to FormData, not inspect it
  if (Boolean(FormData.prototype.get)) {
    describe('form submission', () => {
      let form: HTMLFormElement;

      it('does not submit if not checked', async () => {
        fixt = await fixture(checkboxInForm({name: 'foo'}));
        element = fixt.root.querySelector('md-checkbox')!;
        form = fixt.root.querySelector('form')!;
        await element.updateComplete;
        const formData = simulateFormDataEvent(form);
        expect(formData.get('foo')).toBeNull();
      });

      it('does not submit if disabled', async () => {
        fixt = await fixture(
            checkboxInForm({checked: true, disabled: true, name: 'foo'}));
        element = fixt.root.querySelector('md-checkbox')!;
        form = fixt.root.querySelector('form')!;
        await element.updateComplete;
        const formData = simulateFormDataEvent(form);
        expect(formData.get('foo')).toBeNull();
      });

      it('does not submit if name is not provided', async () => {
        fixt = await fixture(checkboxInForm({checked: true}));
        element = fixt.root.querySelector('md-checkbox')!;
        form = fixt.root.querySelector('form')!;
        await element.updateComplete;
        const formData = simulateFormDataEvent(form);
        const keys = Array.from(formData.keys());
        expect(keys.length).toEqual(0);
      });
    });
  }
});
