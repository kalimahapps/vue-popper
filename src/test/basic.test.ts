
import type { VueWrapper } from '@vue/test-utils';
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VuePopper from '../VuePopper.vue';
const { fn } = vi;

describe('VuePopper', () => {
	it('should render correctly', () => {
		const wrapper = mount(VuePopper);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should clear instance on unmount', () => {
		const wrapper = mount(VuePopper);
		wrapper.unmount();
		expect(wrapper.vm.popperInstance).toBeUndefined();
	});

	it('should change open status on click', async () => {
		const wrapper: VueWrapper<any> = mount(VuePopper);
		await wrapper.find('.trigger-element').trigger('click');
		await flushPromises();
		expect(wrapper.vm.isOpened).toBe(true);
	});

	it('should change open status on hover', async () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				hover: true,
				openDelay: 0,
			},
		});

		await wrapper.find('.trigger-element').trigger('mouseenter');
		await flushPromises();

		expect(wrapper.vm.isOpened).toBe(true);
	});

	it('should change not react on mouseenter if hover not enabled', async () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				hover: false,
			},
		});

		await wrapper.find('.trigger-element').trigger('mouseenter');
		await flushPromises();
		expect(wrapper.vm.isOpened).toBe(false);
	});

	it('should open and close with 2 seconds delay', async () => {
		const t = fn();

		vi.useFakeTimers();

		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				openDelay: 2000,
				closeDelay: 2000,
			},
		});

		// Test open delay
		await wrapper.find('.trigger-element').trigger('click');
		setTimeout(t, 2000);
		vi.advanceTimersByTime(2000);
		await flushPromises();
		expect(wrapper.vm.isOpened).toBe(true);

		// Test close delay
		window.document.body.dispatchEvent(new Event('click'));

		setTimeout(fn(), 5000);
		vi.advanceTimersByTime(5000);
		await flushPromises();
		expect(wrapper.vm.isOpened).toBe(false);
		vi.useRealTimers();
	});
});
