import fabricate from 'fabricate.js';

/// ////////////////////////////////////// Example app build ////////////////////////////////////////

/** Example app state type */
type AppState = {
  counter: number;
  updated: boolean;
};

/**
 * App component.
 *
 * @returns {FabricateComponent} The component.
 */
const App = (): FabricateComponent<AppState> => fabricate('Column')
  .setChildren([
    fabricate('h3').setText('Test TypeScript app'),
    fabricate('p')
      .onUpdate((el, { counter }) => {
        el.setText(`Counted to ${counter}`);
      }, ['counter']),
  ]);

const initialState = { counter: 0, updated: false };
const options: FabricateOptions = {
  logStateUpdates: true,
  persistState: ['counter'],
  strict: false,
  theme: {
    palette: {
      custom: '#444',
    },
    styles: {
      dropShadow: '2px 0px 4px black',
    },
  },
};

fabricate.app(App, initialState, options);

setInterval(() => fabricate.update('counter', ({ counter }) => counter + 1), 1000);

/// ///////////////////////////////// Other, testing types file /////////////////////////////////////

fabricate('div')
  .asFlex('column')
  .setStyles({ color: 'white' })
  .setStyles(({ palette, styles }) => ({
    color: palette.success,
  }))
  .setNarrowStyles(({ palette }) => ({
    color: palette.success,
  }))
  .setAttributes({ disabled: true })
  .addChildren([fabricate('div')])
  .setChildren([
    fabricate('div'),
    fabricate.conditional((state) => state.counter > 0, () => fabricate('Text')),
  ])
  .setHtml('<div/>')
  .setText('foo')
  .onClick((el, state) => console.log(state))
  .onChange((el, state, newValue) => console.log(newValue))
  .onHover((el, state, isHovered) => console.log(isHovered))
  .onUpdate((el, state, updatedKeys) => console.log(updatedKeys), ['counter'])
  .onDestroy((el, state) => console.log('destroyed'))
  .onEvent('load', (el, state, event) => console.log(event))
  // Two forms
  .displayWhen(((state) => !!state), (el, state, isDisplayed) => console.log(isDisplayed))
  .displayWhen(((state) => !!state));

// Three forms
fabricate.update({ counter: 1 });
fabricate.update('foo', 'bar');
fabricate.update('foo', (state) => state.counter);
fabricate.update('updated', true);

fabricate.declare(
  'FooComponent',
  (props): FabricateComponent<AppState> => fabricate('div').setText(props.label),
);

fabricate.onKeyDown((state, key) => console.log(key));

fabricate.buildKey('test', 'prop');
