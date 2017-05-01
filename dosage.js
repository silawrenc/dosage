module.exports = function dosage() {
    const repo  =  new Map();
    const container = {
        register (key, cb) {
            return repo.set(key, typeof cb === "function" ? cb : () => cb);
        },
        singleton (key, cb) {
            return container.register(key, singleton(cb));
        },
        get (key) {
            if (!repo.has(key)) {
                throw new Error(`Trying to access unregistered key: ${key}`);
            }
            return repo.get(key)(container);
        },
        has (key) {
            return repo.has(key);
        }
    };

    return container;
}

const singleton = initialiser => {
    if (typeof initialiser !== "function") {
        return initialiser;
    }
    let service, initialised;
    return container => {
        if (!initialised) {
            service = initialiser(container);
            initialised = true;
        }
        return service;
    }
}
