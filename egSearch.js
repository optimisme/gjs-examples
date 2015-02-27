#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar and a filtered FlowBox

Run it with:
    gjs egSearchjs
*/

const Gdk   = imports.gi.Gdk;
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

    this.title = 'Example Search';
    GLib.set_prgname(this.title);

    this.filterText = '';
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
                                              default_height: 325,
                                              default_width: 720,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.set_titlebar(this.getHeader());
    this.window.add(this.getBody());
};

App.prototype.getHeader = function () {

    let imageSearch;

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.set_show_close_button(true);

    imageSearch = new Gtk.Image ({ icon_name: 'edit-find-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSearch = new Gtk.ToggleButton({ image: imageSearch });
    this.buttonSearch.connect ('clicked', Lang.bind (this, function () { 
        if (this.buttonSearch.get_active()) {
            this.searchBar.set_search_mode(true);
        } else {
            this.searchBar.set_search_mode(false);
        }
    }));

    this.headerBar.pack_end(this.buttonSearch);

    return this.headerBar;
};

App.prototype.getBody = function () {

    this.content = new Gtk.Grid();
    this.content.attach(this.getSearch(), 0, 0, 1, 1);
    this.content.attach(this.getFlow(), 0, 1, 1, 1);

    return this.content;
};

App.prototype.getSearch = function () {
    
    let searchEntry;

    this.searchBar = new Gtk.SearchBar();
    this.searchBar.show();
    searchEntry = new Gtk.SearchEntry();
    searchEntry.show();

    searchEntry.connect('search-changed', Lang.bind (this, function () {
        this.filterText = searchEntry.get_text();
        this.flow.invalidate_filter();
    }));
    this.window.connect('key-press-event', Lang.bind (this, function (widget, event) {
        let key = event.get_keyval()[1];
        if (key !== Gdk.KEY_Escape
            && key !== Gdk.KEY_Up
            && key !== Gdk.KEY_Down
            && key !== Gdk.KEY_Left
            && key !== Gdk.KEY_Right) {
            if (!this.buttonSearch.get_active()) {
                this.buttonSearch.set_active(true);
            }
        } else {
            this.buttonSearch.set_active(false);
        }
    }));
    this.searchBar.connect_entry(searchEntry);
    this.searchBar.add(searchEntry);

    return this.searchBar;
};

App.prototype.getFlow = function () {

    let scroll;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });
    this.flow = new Gtk.FlowBox({ vexpand: true });
    this.flow.set_filter_func(Lang.bind (this, this.filter));

    this.flow.insert(this.newFlowLabel('1a lorem'), -1);
    this.flow.insert(this.newFlowLabel('2b ipsum'), -1);
    this.flow.insert(this.newFlowLabel('3c dolor'), -1);
    this.flow.insert(this.newFlowLabel('4d sit set'), -1);
    this.flow.insert(this.newFlowLabel('5e amet'), -1);
    this.flow.insert(this.newFlowLabel('6f consectetur'), -1);
    this.flow.insert(this.newFlowLabel('7g adipiscing'), -1);
    this.flow.insert(this.newFlowLabel('8h elit'), -1);
    this.flow.insert(this.newFlowLabel('9i set'), -1);

    scroll.add(this.flow);
    return scroll;
};

App.prototype.newFlowLabel = function (text) {

    let label = new Gtk.Label({ label: text });

    label.set_size_request(125, 125);
    return label;
};

App.prototype.filter = function (item) {


    let label = item.get_child().get_label();
   
    if (this.filterText !== '') {
        if (label.indexOf(this.filterText) !== -1) {
            return true;
        } else {
            return false;
        }
    } else {

        return true;
    }
};

App.prototype.printText = function (text) {

    print(text);
};

//Run the application
let app = new App();
app.run(ARGV);
