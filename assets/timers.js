const Mainloop = imports.mainloop;

const setTimeout = function(func, millis) {

    let id = Mainloop.timeout_add(millis, function () {
        func();
        return false; // Stop repeating
    }, null);

    return id;
};

const clearTimeout = function(id) {

    Mainloop.source_remove(id);
};
const setInterval = function(func, millis) {

    let id = Mainloop.timeout_add(millis, function () {
        func();
        return true; // Repeat
    }, null);
    return id;
};

const clearInterval = function(id) {

    Mainloop.source_remove(id);
};

