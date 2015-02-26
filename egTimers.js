#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
emulating setTimeout, clearTimeout, setInterval and clearInterval
functions with Mainloop timeout_add. It also shows how to import
and use an application library

Run it with:
    gjs egTimers.js
*/

const Gio       = imports.gi.Gio;
const GLib      = imports.gi.GLib;
const Gtk       = imports.gi.Gtk;
const Lang      = imports.lang;

// Get application folder and add it into the imports path
function getAppFileInfo() {
    let stack = (new Error()).stack,
        stackLine = stack.split('\n')[1],
        coincidence, path, file;

    if (!stackLine) throw new Error('Could not find current file (1)');

    coincidence = new RegExp('@(.+):\\d+').exec(stackLine);
    if (!coincidence) throw new Error('Could not find current file (2)');

    path = coincidence[1];
    file = Gio.File.new_for_path(path);
    return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}
const path = getAppFileInfo()[1];
imports.searchPath.push(path);

// Import the application library
const Timers    = imports.assets.timers;

const App = function () { 

    this.title = 'Example Timers';
    GLib.set_prgname(this.title);

    this.idTimeout;
    this.idInterval;
    this.counter = 0;
};

App.prototype.run = function (ARGV) {

    this.application = new Gtk.Application();
    this.application.connect('activate', Lang.bind(this, this.onActivate));
    this.application.connect('startup', Lang.bind(this, this.onStartup));
    this.application.run([]);
};

App.prototype.onActivate = function () {

    this.window.show_all();
};

App.prototype.onStartup = function() {

    this.buildUI();
};

App.prototype.buildUI = function() {

    let scroll;

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              default_height: 200,
                                              default_width: 200,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let grid, buttonST, buttonCT, buttonSI, buttonCI;

    grid = new Gtk.Grid();
    grid.set_column_spacing(6);
    grid.set_row_spacing(6);
    grid.set_border_width(8);

    buttonST = new Gtk.Button({ label: "setTimeout" });
    buttonST.connect ('clicked', Lang.bind (this, this.actionSetTimeout));

    this.buttonCT = new Gtk.Button({ label: "clearTimeout" });
    this.buttonCT.connect ('clicked', Lang.bind (this, this.actionClearTimeout));
    this.buttonCT.set_sensitive(false);

    this.labelS = new Gtk.Label({ label: "-" });
    this.labelS.set_size_request(200, -1);

    buttonSI = new Gtk.Button({ label: "setInterval" });
    buttonSI.connect ('clicked', Lang.bind (this, this.actionSetInterval));

    this.buttonCI = new Gtk.Button({ label: "clearInterval" });
    this.buttonCI.connect ('clicked', Lang.bind (this, this.actionClearInterval));
    this.buttonCI.set_sensitive(false);

    this.labelC = new Gtk.Label({ label: "-" });
    this.labelC.set_size_request(200, -1);

    grid.attach(buttonST, 0, 0, 1, 1);
    grid.attach(this.buttonCT, 1, 0, 1, 1);
    grid.attach(this.labelS, 2, 0, 1, 1);
    grid.attach(buttonSI, 0, 1, 1, 1);
    grid.attach(this.buttonCI, 1, 1, 1, 1);
    grid.attach(this.labelC, 2, 1, 1, 1);

    return grid;
};

App.prototype.actionSetTimeout = function () {

    this.buttonCT.set_sensitive(true);
    this.labelS.set_text('Wait 2s');
    this.idTimeout = Timers.setTimeout(Lang.bind(this, function () {

        this.buttonCT.set_sensitive(false);
        this.labelS.set_text('Now');

    }), 2000);
};

App.prototype.actionClearTimeout = function () {

    this.buttonCT.set_sensitive(false);
    this.labelS.set_text('-');
    Timers.clearTimeout(this.idTimeout);
};

App.prototype.actionSetInterval = function () {

    this.buttonCI.set_sensitive(true);
    this.labelC.set_text('Wait');
    this.counter = 0;
    this.idInterval = Timers.setInterval(Lang.bind(this, function () {
        this.counter = this.counter + 1;
        this.labelC.set_text(this.counter.toString());
    }), 500);
};

App.prototype.actionClearInterval = function () {

    this.buttonCI.set_sensitive(false);
    this.labelC.set_text('-');
    Timers.clearInterval(this.idInterval);
};

//Run the application
let app = new App();
app.run(ARGV);
