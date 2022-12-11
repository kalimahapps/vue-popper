# Default Popper Options

These are the default popper options that will be passed to the component. If you want to override these or add new ones, you can pass your custom options to the each respective prop/option. See [props & options](./props-options) for more information.
```json
{
  placement: 'top',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: 8,
      },
    },
    {
      name: 'arrow',
      options: {
        padding: 5,
      },
    },
  ],
}
```