#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar, ActionBar and a filtered FlowBox

Run it with:
    gjs egSearchjs
*/

const Gio   = imports.gi.Gio;
const Gdk   = imports.gi.Gdk;
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
    this.selectionMode = false;
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
    this.buttonCancel.hide();
    this.actionBar.hide();
};

App.prototype.onStartup = function() {

    this.buildUI();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application });
    this.window.set_default_size(720, 300);
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.set_titlebar(this.getHeader());

    this.content = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

    this.content.add(this.getSearch());
    this.content.add(this.getBody());
    this.content.add(this.getActionBar());

    this.window.add(this.content);
};

App.prototype.getHeader = function () {

    let headerEnd, imageSearch, imageSelect;

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.set_show_close_button(true);

    headerEnd = new Gtk.Grid();
    headerEnd.set_column_spacing(this.headerBar.spacing);

    imageSearch = new Gtk.Image ({ icon_name: 'edit-find-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSearch = new Gtk.ToggleButton({ image: imageSearch });
    this.buttonSearch.connect ('clicked', Lang.bind (this, function () { 
        if (this.buttonSearch.get_active()) {
            this.searchBar.set_search_mode(true);
        } else {
            this.searchBar.set_search_mode(false);
        }
    }));

    imageSelect = new Gtk.Image ({ icon_name: 'emblem-ok-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSelect = new Gtk.Button({ image: imageSelect });
    this.buttonSelect.connect ('clicked', Lang.bind (this, function () { this.selectionShow(true); }));

    this.buttonCancel = new Gtk.Button({ label: "Cancel" });
    this.buttonCancel.connect ('clicked', Lang.bind (this, function () { this.selectionShow(false); }));

    headerEnd.attach(this.buttonSearch, 0, 0, 1, 1);
    headerEnd.attach(this.buttonSelect, 1, 0, 1, 1);
    headerEnd.attach(this.buttonCancel, 2, 0, 1, 1);
    this.headerBar.pack_end(headerEnd);

    return this.headerBar;
};

App.prototype.getSearch = function () {
    
    let searchBox, searchEntry;

    this.searchBar = new Gtk.SearchBar();
    this.searchBar.show();
    searchBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, halign: Gtk.Align.CENTER });
    searchBox.show();
    searchEntry = new Gtk.SearchEntry();
    searchBox.add(searchEntry);
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
            if (this.buttonSearch.get_active()) {
                this.buttonSearch.set_active(false);
            } else if (this.selectionMode) {
                this.selectionShow(false);
            }
        }
    }));
    this.searchBar.connect_entry(searchEntry);
    this.searchBar.add(searchBox);

    return this.searchBar;
};

App.prototype.getBody = function () {

    let scroll;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });
    this.flow = new Gtk.FlowBox({ vexpand: true });
    this.flow.set_filter_func(Lang.bind (this, this.filter));

    this.flow.insert(this.newFlowLabel('1a'), -1);
    this.flow.insert(this.newFlowLabel('2b'), -1);
    this.flow.insert(this.newFlowLabel('3c'), -1);
    this.flow.insert(this.newFlowLabel('4d'), -1);
    this.flow.insert(this.newFlowLabel('5e'), -1);
    this.flow.insert(this.newFlowLabel('6f'), -1);
    this.flow.insert(this.newFlowLabel('7g'), -1);
    this.flow.insert(this.newFlowLabel('8h'), -1);
    this.flow.insert(this.newFlowLabel('9i'), -1);

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

App.prototype.getActionBar = function () {

    this.actionBar = new Gtk.ActionBar();

    let label = new Gtk.Label({ label: "Action bar contents" });
    this.actionBar.pack_start(label);

    return this.actionBar;
};

App.prototype.selectionShow = function (show) {

    this.selectionMode = show;

    if (show) {
        this.buttonSelect.hide();
        this.buttonCancel.show();
        this.headerBar.set_show_close_button(false);
        this.headerBar.get_style_context().add_class('selection-mode');
        this.actionBar.show();
    } else {
        this.buttonSelect.show();
        this.buttonCancel.hide();
        this.headerBar.set_show_close_button(true);
        this.headerBar.get_style_context().remove_class('selection-mode');
        this.actionBar.hide();
    }
};

App.prototype.printText = function (text) {

    print(text);
};

//Run the application
let app = new App();
app.run(ARGV);
