#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
setting the application icon from the 'assets' folder and if
not available from the 'stock icons'

Run it with:
    gjs egIcon.js
*/

const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;

const App = function () { };

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

    let result = false;

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: "Example Icon" });
    this.window.set_default_size(200, 200);
    try {
        this.window.set_icon_from_file('./assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.label = new Gtk.Label({ label: "Hello icon" });
    this.window.add(this.label);
};

//Run the application
let app = new App();
app.run(ARGV);
