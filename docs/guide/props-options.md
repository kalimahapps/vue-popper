# Props & Options

## Props

Props are used to pass date using component.

### `animation`

Determines the animation to use when showing/hiding the tooltip.
You can also pass a custom animation name to use your own animation.

- Type: string
- Default value: `shift-in`
- Accepted values: `none`, `fade`, `shift-in`, `shift-out`, `scale`, `custom-name`

### `animation-duration`

Determines the duration of the animation of showing/hiding the tooltip in milliseconds.

It accepts a number or an array of numbers. If an array is passed,
the first number is the duration of the show animation and the second number is the duration of the hide animation.

- Type: number | array
- Default value: `300`

### `close-delay`

Determines how many milliseconds to wait before closing the tooltip

- Type: number
- Default value: `150` (only applies when `hover` and `interactive` is true) or `0` (otherwise)

### `disable-click-outside`

Disable clicking outside to close

- Type: boolean
- Default value: `false`

### `hover`

Determine if hover will trigger the tooltip

- Type: boolean.
- Default value: `false`

### `interactive`

Determines if the tooltip should be interactive. Applies only when `hover` is true

- Type: boolean
- Default value: `false`

### `modifiers`

An array of modifiers to add to the tooltip. See [Popper.js modifiers](https://popper.js.org/popper-documentation.html#modifiers) for more information.
If the modifier already exists, it will be overwritten.

- Type: array
- Default value: `[]`

### `open-delay`

Determines how many milliseconds to wait before opening the tooltip

- Type: number
- Default value: `0`

### `placement`

Determines the placement of the tooltip

- Type: string
- Default value: `top`
- Accepted values: `top`, `bottom`, `left`, `right`

### `strategy`

The strategy to use to position the tooltip.

- Type: string
- Default value: `absolute`
- Accepted values: `absolute`, `fixed`

### `show-arrow`

Determine if the arrow should be shown

- Type: boolean
- Default value: `true`

## Options

Options are similar to props but are used to pass data to composition API. They are in camelCase. This is a table of props with their corresponding options:
| Prop                  | Option              |
| --------------------- | ------------------- |
| animation             | animation           |
| animation-duration    | animationDuration   |
| close-delay           | closeDelay          |
| disable-click-outside | disableClickOutside |
| hover                 | hover               |
| interactive           | interactive         |
| modifiers             | modifiers           |
| open-delay            | openDelay           |
| placement             | placement           |
| strategy              | strategy            |
| show-arrow            | showArrow           |
