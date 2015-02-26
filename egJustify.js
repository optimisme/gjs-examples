#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk.Label and its justification options

Run it with:
    gjs egJustify.js
*/

const Gio   = imports.gi.Gio;
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

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: "Example Justify" });
    this.window.set_default_size(200, 200);
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let left, center, right, justify, grid;

    left = this.getLabel(Gtk.Justification.LEFT);
    center = this.getLabel(Gtk.Justification.CENTER);
    right = this.getLabel(Gtk.Justification.RIGHT);
    justify  = this.getLabel(Gtk.Justification.FILL);

    grid = new Gtk.Grid();
    grid.set_column_spacing(25);
    grid.set_border_width(15);
    grid.attach(left, 0, 0, 1, 1);
    grid.attach(center, 1, 0, 1, 1);
    grid.attach(right, 2, 0, 1, 1);
    grid.attach(justify, 3, 0, 1, 1);

    return grid;
};

App.prototype.getLabel = function(justification) {

    let text, label;

    text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';

    label = new Gtk.Label({ halign: Gtk.Align.CENTER, label: text, valign: Gtk.Align.START });
    label.set_size_request(100, -1);
    label.set_ellipsize(Pango.EllipsizeMode.END);
    label.set_max_width_chars(10);
    label.set_line_wrap(true);
    label.set_justify(justification);
    label.set_lines(6);

    return label;
};

//Run the application
let app = new App();
app.run(ARGV);
