# dosage

[![Master branch build status][ico-build]][travis]
[![Published version][ico-package]][package]
[![ISC Licensed][ico-license]][license]

**dosage** provides a super simple (36 loc!) api for a javascript dependency injection container. This is my opinionated take on how to do DI containers in javascript, I *don't* have an opinion about whether or not you should use it.

```js
import dosage from "dosage";
const di = dosage();

di.register("foo", () => new Foo());
di.register("bar", di => new Bar(di.get("foo")));
di.singleton("baz", () => new Baz());

/* fast forward to... */
const foo = di.has("foo") ? di.get("foo") : "Nope";
```

### API
#### Putting things in the container
The API is designed to be as simple as possible, but no more so. The `register` method lets you store things against keys in the container. The key can be any javascript value. If you provide a callback for the second argument to register, it will be invoked every time that key is accessed with the return value of the callback being returned (allowing you to have lazily loaded "services"). The callback is invoked with the container object as a sole argument, allowing you to fetch further dependencies according to arbitrary logic inside your callback. If you provide anything other than a callback as a second argument it will be returned as-is each time the key is accessed (this gives you a basic singleton pattern). If you need lazy-loaded singletons, use the `singleton` method in place of `register`. This will guarantee the provided callback is called at most once (you can use the `singleton` method with non-callback values too, but then it's functionally identical to `register`).
```js
const foo = {a, b, c};
/* simple value store with arbitrary keys */
di.register(foo, 100);
/* lazy loading */
di.register(foo, () => new Foo());
/* singleton with dependencies */
di.singleton("bar", di => new Bar(di.get(foo)));
/* pointless, just use register for values */
di.singleton("baz", new Baz());
```

#### Getting things out
You can use the `has` method to see if a key is registered in the container. Using `has` won't invoke any callbacks. Use `get` to access the value of that key.
```js
di.register("foo", () => "bar");
di.has("foo"); // true
di.has("other"); // false
di.get("foo"); // "bar"
```

### Install
```sh
npm install dosage
# optionally run tests (you'll need tap installed)
npm test
```
[travis]: https://travis-ci.org/silawrenc/dosage
[package]: https://www.npmjs.com/package/dosage
[ico-build]: http://img.shields.io/travis/silawrenc/dosage/master.svg
[ico-license]: https://img.shields.io/github/license/silawrenc/dosage.svg
[ico-package]: https://img.shields.io/npm/v/dosage.svg
[license]: LICENSE
