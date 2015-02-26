#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk.EventBox to catch events for widgets which do not 
have their own window

Run it with:
    gjs egJustify.js
*/

const Gio   = imports.gi.Gio;
const GLib  = imports.gi.GLib;
const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;
const Pango = imports.gi.Pango;

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

const App = function () { 
    this.title = 'Example Event';
    GLib.set_prgname(this.title);

    this.text = 'Click here ... ';
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

    let event;

    this.label = new Gtk.Label({ halign: Gtk.Align.CENTER, label: this.text, valign: Gtk.Align.CENTER });

    event = new Gtk.EventBox();
    event.add(this.label);
    event.connect('button-press-event',  Lang.bind(this, function() { 
        this.counter = this.counter + 1;
        this.label.set_text(this.text + this.counter);
    }));

    return event;
};

//Run the application
let app = new App();
app.run(ARGV);
