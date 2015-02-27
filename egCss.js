#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk.CssProvider from source code or from loaded .css files

Run it with:
    gjs egCss.js
*/

const Gio   = imports.gi.Gio;
const GLib  = imports.gi.GLib;
const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;

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
    this.title = 'Example Css';
    GLib.set_prgname(this.title);
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
        this.window.set_icon_from_file(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let content, css1, label1, css2, label2;

    // CSS from source code
    css1 = new Gtk.CssProvider();
    css1.load_from_data(' * { color: #0a0; font-size: 12px; background-color: rgba(0, 0, 0, 0.5); border-radius: 5px; }');

    label1 = new Gtk.Label({ halign: Gtk.Align.CENTER, label: 'Source code CSS', valign: Gtk.Align.CENTER });
    label1.get_style_context().add_provider(css1, 0);
    label1.set_size_request(150, 35);

    // CSS from .css file class
    css2 = new Gtk.CssProvider();
    css2.load_from_path(path + '/assets/egCss.css');

    label2 = new Gtk.Label({ halign: Gtk.Align.CENTER, label: 'CSS from file', valign: Gtk.Align.CENTER });
    label2.get_style_context().add_provider(css2, 0);
    label2.set_size_request(150, 35);
    
    content = new Gtk.Grid({ halign: Gtk.Align.CENTER, column_spacing: 10, margin: 15, row_spacing: 10 });
    content.attach(label1, 0, 0, 1, 1);
    content.attach(label2, 0, 1, 1, 1);

    return content;
};

//Run the application
let app = new App();
app.run(ARGV);

// More information: https://thegnomejournal.wordpress.com/2011/03/15/styling-gtk-with-css/
