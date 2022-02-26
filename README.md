# fabricate

> n. To create quickly and easily.

![](logo.png)

A tiny vanilla JS webapp framework with a fluent API and zero dependencies,
intended for small apps with relatively simply layouts. Comes with some
pre-prepared components to get started quickly.

- [Introduction](#introduction)
- [Installation](#installation)
- [API](#api)
- [Run tests](#run-tests)

See `examples` for some simple example apps.


## Installation

Install from a CDN, such as `unpkg`:

```html
<!-- Where x.y.z is a published version -->
<script src="https://unpkg.com/fabricate.js@x.y.z/fabricate.js"></script>
```

or install from [npm](https://www.npmjs.com/package/fabricate.js) and copy or
reference `fabricate.js` from `node_modules`.


## Introduction

The aim of `fabricate` is to allow a quick and expressive way to set up UI
with a fluent API based on method chaining. This allows creating elements with
styles, attributes, handlers, and child elements in an easy and predictable
fashion.

For example, a text element in a padded container:

```js
const Text = (text) => fabricate('span')
  .setText(text)
  .withStyles({ fontSize: '1.1rem' });

const Container = () => fabricate('div')
  .asFlex('column')
  .withStyles({ padding: '10px' });

const ExamplePage = () => Container()
  .withChildren([
    Text('Hello, world!'),
    Text('Welcome to fabricate.js!'),
  ]);

// Use as the root app element
fabricate.app(ExamplePage());
```

Components can be extended after they are created, for example a button with
a hover-based effect:

```js
const BasicButton = () => fabricate('div')
  .asFlex('column')
  .withStyles({
    padding: '8px 10px',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '5px',
    justifyContent: 'center',
    cursor: 'pointer',
  })
  .onHover({
    start: el => el.addStyles({ filter: 'brightness(1.1)' }),
    end: el => el.addStyles({ filter: 'brightness(1)' }),
  });

const SubmitButton = () => BasicButton()
  .setText('Submit')
  .withStyles({ backgroundColor: 'green' })
  .onClick(() => alert('Success!'));

const CancelButton = () => BasicButton()
  .setText('Cancel')
  .withStyles({ backgroundColor: 'red' })
  .onClick(() => alert('Cancelled!'));
```

See the `examples` directory for more examples.

Some basic components are available to quickly build UI, see below for more
details.


## Installation

Just include in your HTML file, such as in a `lib` directory:

```html
<script type="text/javascript" src="./lib/fabricate.js"></script>
```

## API

* [Create `Component`](#component)
  * [`.asFlex()`](#asflex)
  * [`.withStyles()` / `withAttributes()`](#withstyles--withattributes)
  * [`.withChildren()`](#withchildren)
  * [`.onClick()` / `onHover()` / `onChange()`](#onclick--onhover--onchange)
  * [`.clear()`](#clear)
  * [`.then()`](#then)
* [`fabricate` helpers](#fabricate-1)
  * [`.isMobile()`](#ismobile)
  * [`.app()`](#app)
  * [`.updateState()` / `.watchState()`](#updatestate--watchstate)
  * [`.when()`](#when)
* [Built-in Components](#built-in-components)
  * [`Row`](#row)
  * [`Column`](#column)
  * [`Text`](#text)
  * [`Image`](#image)
  * [`Button`](#button)
  * [`NavBar`](#navbar)
  * [`TextInput`](#textinput)
  * [`Loader`](#loader)
  * [`Card`](#card)
  * [`Fader`](#fader)
  * [`Pill`](#pill)


### `Component`

To create a `Component`, simply specify the tag name:

```js
const EmptyDivComponent = () => fabricate('div');
```

#### `.asFlex()`

To quickly set basic `display: flex` and `flexDirection`:

```js
const Column = () => fabricate('div').asFlex('column');
```

> The `Row` and `Column` basic components are included for this purpose.

#### `.withStyles()` / `withAttributes()`

Use more method chaining to flesh out the component:

```js
const BannerImage = (src) => fabricate('img')
  .withStyles({
    width: '800px',
    height: 'auto',
  })
  .withAttributes({ src });
```

> Semantic aliases `addStyles()` and `addAttributes()` are also available.

#### `.withChildren()`

Add other components as children to a parent:

```js
const ButtonRow = () => fabricate.Row()
  .withChildren([
    fabricate.Button({ text: 'Submit'}),
    fabricate.Button({ text: 'Cancel'}),
  ]);
```

> A semantic alias `addChildren` is also available.

#### `.onClick()` / `onHover()` / `.onChange()`

Add click and hover behaviors, which are provided the same element to allow
updating styles and attributes etc:

```js
fabricate.Button({ text: 'Click me!' })
  .onClick(el => alert('Clicked!'))
  .onHover({
    start: el => console.log('maybe clicked'),
    end: el => console.log('maybe not'),
  });
```

Hovering can also be implemented with just a callback if preferred:

```js
fabricate.Button({ text: 'Click me!' })
  .onClick(el => alert('Clicked!'))
  .onHover((el, hovering) => console.log(`hovering: ${hovering}`));
```

For inputs, the `change` even can also be used:

```js
fabricate.TextInput({ placeholder: 'Email address' })
  .onChange((el, value) => console.log(`Entered ${value}`));
```

#### `.setText()` / `.setHtml()`

For simple elements, set their `innerHTML` or `innerText`:

```js
fabricate('div')
  .withStyles({ backgroundColor: 'red' })
  .setText('I am a red <div>');
```

Or set HTML directly:

```js
fabricate('div')
  .setHtml('<span>I\'m just more HTML!</div>');
```

#### `.clear()`

For components such as lists that refresh data, use `clear()` to remove
all children:

```js
const UserList = ({ users }) => fabricate('div')
  .asFlex('column')
  .withChildren(users.map(User));

/**
 * When new data is available.
 */
const refreshUserList = (newUsers) => {
  userList.clear();
  userList.addChildren(newUsers.map(User));
};
```

#### `.then()`

Simple method to do something immediately after creating a component with
chain methods:

```js
fabricate.Text({ text: 'Example text' })
  .withStyles({ color: 'blue' })
  .then(() => console.log('Text was created'));
```


### `fabricate`

The imported object also has some helper methods to use:

#### `.isMobile()`

```js
// Detect a very narrow device, or mobile device
fabricate.Text()
  .withStyles({ fontSize: fabricate.isMobile() ? '1rem' : '1.8rem' })
```

#### `.app()`

Use `app()` to start an app from the `document.body`:

```js
const page = PageContainer()
  .withChildren([
    fabricate.Title('My New App'),
    fabricate.NavBar(),
    MainContent()
      .withChildren([
        HeroImage(),
        Introduction(article.body),
      ]),
  ]);

fabricate.app(page);
```

#### `.updateState()` / `.watchState()`

A few methods are available to make it easy to maintain some basic global state
and to update components when those states change. See the
[counter](examples/counter.html) example for a full example.

```js
// View can watch some state
const counterView = fabricate.Text()
  .watchState((el, state, updatedKey) => {
    // Ignore unrelated changes
    if (updatedKey !== 'counter') return;

    el.setText(state.counter);
  });

// Initialise first state
fabricate.app(counterView, { counter: 0 });

// Update the state using the previous state
setInterval(() => {
  fabricate.updateState('counter', prev => prev.counter + 1);
}, 1000);
```

#### `.when()`

Conditionally add or remove a component (or tree of components) using the `when`
method:

```js
const pageContainer =  fabricate.Column()
  .withChildren([
    // Check some state, and provide a function to build the component to show
    fabricate.when(
      state => state.showText,
      () => fabricate.Text({ text: 'Now you see me!'}),
    ),
  ]);

// Use as the root app element and provide first state values
fabricate.app(pageContainer, { showText: false });

// Later, add the text
setInterval(
  () => fabricate.updateState('showText', state => !state.showText),
  2000,
);
```

See [`examples/login.html`](examples/login.html) for a more complex example of
conditional rendering in action.


### Built-in Components

#### `Row`

A simple flex row:

```js
fabricate.Row()
  .withChildren([
    fabricate.Button().setText('Confirm'),
    fabricate.Button().setText('Cancel'),
  ]);
```

#### `Column`

A simple flex column:

```js
fabricate.Column()
  .withChildren([
    fabricate.Image({ src: '/assets/images/gallery1.png' }),
    fabricate.Image({ src: '/assets/images/gallery2.png' }),
  ]);
```

#### `Text`

Basic text component:

```js
fabricate.Text({ text: 'Hello, world!' });
```

#### `Image`

Basic image component:

```js
fabricate.Image({
  src: '/assets/images/gallery01.png',
  width: 640,
  height: 480,
});
```

#### `Button`

A simple button component with optional hover highlight behavior:

```js
fabricate.Button({
  text: 'Click me!',
  color: 'white',
  backgroundColor: 'gold',
  highlight: true,
});
```

#### `NavBar`

NavBar component for app titles, etc. Can contain more components within itself:

```js
fabricate.NavBar({
  title: 'My Example App',
  color: 'white',
  backgroundColor: 'purple',
})
  .withChildren([
    fabricate.Button({ text: 'Home' })
      .onClick(goHome),
    fabricate.Button({ text: 'Gallery' })
      .onClick(goToGallery),
  ]);
```

#### `TextInput`

A basic text input box with padding:

```js
fabricate.TextInput({
  placeholder: 'Enter email address',
  color: '#444',
  backgroundColor: 'white'
})
  .onChange((el, newVal) => console.log(`Email now ${newVal}`));
```

#### `Loader`

Customizable CSS-based spinner/loader:

```js
fabricate.Loader({
  size: 48,
  lineWidth: 5,
  color: 'red',
});
```

#### `Card`

Simple Material-like card component for housing sections of other components:

```js
fabricate.Card()
  .withChildren([
    fabricate.Image({ src: '/assets/images/gallery01.png' }),
  ]);
```

#### `Fader`

Container that fades in upon creation to smoothly show other components inside:

```js
fabricate.Fader({
  durationS: 0.6,
  delayMs: 300,
});
```

#### `Pill`

Basic pill for category selection or tags etc:

```js
fabricate.Row()
  .withChildren([
    Pill({
      text: 'All',
      color: 'white',
      backgroundColor: 'green',
    }),
    Pill({
      text: 'Favorites',
      color: 'white',
      backgroundColor: 'red',
    }),
    Pill({
      text: 'Unread',
      color: 'white',
      backgroundColor: 'blue',
    }),
  ]);
```

## Run tests

Open the test page to run all unit tests:

```shell
python3 -m http.server
```

Open `localhost:8000`, then navigate to `test/index.html` and see if all test
summaries are green and the total indicates all tests passed.
