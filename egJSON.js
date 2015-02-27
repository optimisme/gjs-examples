#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
reading and writting JSON files, the example makes use of
Gio.File.new_for_path, replace_async, load_contents_async

Run it with:
    gjs egJSON.js
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

// Import spawn library
//const Spawn = imports.assets.spawn;

const App = function () { 

    this.title = 'Example JSON';
    GLib.set_prgname(this.title);

    this.info = {};
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
                                              default_width: 400,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {
    
    let buttonR, buttonW, grid;

    buttonR = new Gtk.Button({ hexpand: true, halign: Gtk.Align.CENTER, label: 'Read JSON' });
    buttonR.connect ('clicked', Lang.bind (this, this.read));

    buttonW = new Gtk.Button({ hexpand: true, halign: Gtk.Align.CENTER, label: 'Write JSON' });
    buttonW.connect ('clicked', Lang.bind (this, this.write));

    this.label = new Gtk.Label({ label: '' });

    grid = new Gtk.Grid({ column_spacing: 6, margin: 15, row_spacing: 6 });
    grid.attach(buttonR, 0, 0, 1, 1);
    grid.attach(buttonW, 1, 0, 1, 1);
    grid.attach(this.label, 0, 1, 2, 1);

    return grid;
};

App.prototype.read = function() {

    let file;

    file = Gio.File.new_for_path(path + '/assets/egJSON.json');

    file.load_contents_async(null, Lang.bind(this, function(file, res) {
        let contents;
        try {
            contents = file.load_contents_finish(res)[1].toString();
            this.info = JSON.parse(contents);
            if (typeof this.info['counter-read'] !== 'undefined') {
                this.info['counter-read'] = this.info['counter-read'] + 1;
            }
            this.label.set_text(JSON.stringify(this.info));
        } catch (e) {
            return;
        }
    }));
};

App.prototype.write = function() {

    let text, file;

    if (typeof this.info['counter-read'] !== 'undefined' && typeof this.info['counter-write'] !== 'undefined') {

        this.info['counter-write'] = this.info['counter-write'] + 1;
        text = JSON.stringify(this.info);

        file = Gio.File.new_for_path(path + '/assets/egJSON.json');
        file.replace_async(null, false, 
            Gio.FileCreateFlags.REPLACE_DESTINATION,
            GLib.PRIORITY_LOW, null, Lang.bind(this, function(file, res) {

                let stream;
                if (!res.had_error()) {
                    stream = file.replace_finish(res);
                    stream.write(text, null);
                    stream.close(null);
                }
        }));

    } else {
        this.label.set_text('Read the file first');
    }
};

//Run the application
let app = new App();
app.run(ARGV);

