const tap = require("tap");
const dosage = require("./dosage.js");
const counter = () => {
    let count = 0;
    const fn = () => {
        count++;
        return "counter";
    }
    fn.called = () => count;
    return fn;
}

tap.test("Counter utility works", t => {
    let c = counter();
    c(); c(); c();
    t.equal(c.called(), 3, "called three times");
    t.end();
});

tap.test("Construct a DI container", t => {
    const di = dosage();
    t.equal(typeof di.register,"function", "has register method");
    t.equal(typeof di.singleton, "function", "has singleton method");
    t.equal(typeof di.get, "function", "has get method");
    t.equal(typeof di.has, "function", "has has method");
    t.end();
});

tap.test("Register works with value", t => {
    const di = dosage();
    di.register("foo", 31);
    t.equal(di.has("foo"), true, "has the key");
    t.equal(di.get("foo"), 31, "returns the correct value");
    t.end();
});

tap.test("Register works with callback", t => {
    const di = dosage();
    const cb = counter();
    di.register("foo", cb);
    t.equal(di.has("foo"), true, "has the key");
    t.equal(cb.called(), 0, "hasn't called the function");

    const a = di.get("foo");
    const b = di.get("foo");

    t.equal(a, "counter", "correct return value a");
    t.equal(b, "counter", "correct return value b");
    t.equal(cb.called(), 2, "called the function twice");
    t.end();
});

tap.test("Register works with object key", t => {
    const di = dosage();
    let key = {foo: 2};
    di.register(key, 31);
    t.equal(di.has(key), true, "has the key");
    t.equal(di.get(key), 31, "returns the correct value");
    t.end();
});

tap.test("Singleton works with value", t => {
    const di = dosage();
    di.singleton("foo", 41);
    t.equal(di.has("foo"), true, "has the key");
    t.equal(di.get("foo"), 41, "returns the correct value");
    t.end();
});

tap.test("Singleton works with callback", t => {
    const di = dosage();
    const cb = counter();
    di.singleton("foo", cb);
    t.equal(di.has("foo"), true, "has the key");
    t.equal(cb.called(), 0, "hasn't called the function");

    const a = di.get("foo");
    const b = di.get("foo");

    t.equal(a, "counter", "correct return value a");
    t.equal(b, "counter", "correct return value b");
    t.equal(cb.called(), 1, "called the function once");
    t.end();
});

tap.test("Singleton works with object key", t => {
    const di = dosage();
    let key = {bar: 2};
    di.singleton(key, 31);
    t.equal(di.has(key), true, "has the key");
    t.equal(di.get(key), 31, "returns the correct value");
    t.end();
});

tap.test("Register allows overriding values", t => {
    const di = dosage();
    di.register("foo", 3);
    di.register("foo", 5);
    t.equal(di.get("foo"), 5, "latest set value used");
    t.end();
});

tap.test("Has returns false for missing value", t => {
    const di = dosage();
    t.throws(() => di.get("foo"), new Error("Trying to access unregistered key: foo"), "throws when getting missing key");
    t.end();
});
