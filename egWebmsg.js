#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Webkit.WebView, also showing how to send messages from GTK
to Webkit and viceversa

Run it with:
    gjs egWebmsg.js
*/

const GLib  = imports.gi.GLib;
const Gio   = imports.gi.Gio;
const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;
const Webkit = imports.gi.WebKit;

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
                                              title: "Example Web Messages" });
    this.window.set_default_size(200, 200);
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let webView, button, label, grid;

    webView = new Webkit.WebView();
    webView.load_uri(GLib.filename_to_uri (path + '/assets/exWebmsg.html', null));
    webView.set_vexpand(true);
    webView.connect('status_bar_text_changed', Lang.bind(this, function (arg, txt) {
        // Get Webkit messages into GTK listening to 'status bar/window.status' signals
        label.label = txt;
    }));

    button = new Gtk.Button({ label: 'GTK to Webkit message' });
    button.connect('clicked', Lang.bind(this,
        function() {
            // Execute one Webkit function to send a message from GTK to Webkit
            webView.execute_script('messageFromGTK("Message from GTK!");');
        }));

    label = new Gtk.Label({ label: '' });

    grid = new Gtk.Grid({ column_homogeneous: true });
    grid.attach (webView, 0, 0, 2, 1);
    grid.attach (button, 0, 1, 1, 1);
    grid.attach (label, 1, 1, 1, 1);

    return grid;
}; 

//Run the application
let app = new App();
app.run(ARGV);
