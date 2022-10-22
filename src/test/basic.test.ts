import { mount, VueWrapper } from '@vue/test-utils';
import VuePopper from '../vue-popper.vue';
import { describe, it, expect, vi } from 'vitest'
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
		await wrapper.find(".trigger-element").trigger("click");
		expect(wrapper.vm.isOpened).toBe(true);
	});

	it('should change open status on hover', async () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				hover: true
			}
		});

		await wrapper.find(".trigger-element").trigger("mouseenter");
		expect(wrapper.vm.isOpened).toBe(true);
	});

	it('should change not react on mouseenter if hover not enabled', async () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				hover: false
			}
		});

		await wrapper.find(".trigger-element").trigger("mouseenter");
		expect(wrapper.vm.isOpened).toBe(false);
	});

	it('should open and close with 2 seconds delay', async () => {
		const t = fn();

		vi.useFakeTimers();

		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				openDelay: 2000,
				closeDelay: 2000
			}
		});

		// Test open delay
		await wrapper.find(".trigger-element").trigger("click");
		setTimeout(t, 2000);
		vi.advanceTimersByTime(2000);
		expect(wrapper.vm.isOpened).toBe(true);


		// Test close delay
		window.document.body.dispatchEvent(new Event('click'));

		setTimeout(fn(), 5000);
		vi.advanceTimersByTime(5000);

		expect(wrapper.vm.isOpened).toBe(false);
		vi.useRealTimers();
	});

	it('getOffset should return x,y object', () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				popperOptions: {
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [10, 10],
							},
						},
					]
				}
			}
		});

		expect(wrapper.vm.getOffset).toEqual({ x: 10, y: 10 });
	});

	it('getContainerStyle should return an object of border style', () => {
		const wrapper: VueWrapper<any> = mount(VuePopper, {
			props: {
				hover: true,
				interactive: true,
			}
		});

		expect(wrapper.vm.getContainerStyle).toEqual({ border: '12px solid transparent', margin: `-12px` });
	});
});

