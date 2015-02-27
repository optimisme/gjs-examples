#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar, ActionBar, a filtered FlowBox,
an application library and custom widgets to create a selection
mode

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

const Select = imports.assets.select;

const App = function () { 

    this.title = 'Example Select';
    GLib.set_prgname(this.title);

    this.selectionMode = false;
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
    this.flow.setSelectingMode(false);
};

App.prototype.onStartup = function() {

    this.buildUI();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              default_height: 400,
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

    let headerEnd, imageSearch, imageSelect;

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.set_show_close_button(true);

    headerEnd = new Gtk.Grid({ column_spacing: this.headerBar.spacing });

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

App.prototype.getBody = function () {

    this.content = new Gtk.Grid();
    this.content.attach(this.getSearch(), 0, 0, 1, 1);
    this.content.attach(this.getFlow(), 0, 1, 1, 1);
    this.content.attach(this.getActionBar(), 0, 2, 1, 1);

    return this.content;
};

App.prototype.getSearch = function () {
    
    let searchEntry;

    this.searchBar = new Gtk.SearchBar();
    this.searchBar.show();
    searchEntry = new Gtk.SearchEntry();
    searchEntry.show();

    searchEntry.connect('search-changed', Lang.bind (this, function () {
        this.flow.filterText = searchEntry.get_text();
        this.flow.widget.invalidate_filter();
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
    this.searchBar.add(searchEntry);

    return this.searchBar;
};

App.prototype.getFlow = function () {

    let scroll, id;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });

    this.flow = new Select.SelectFlow();
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 1 lorem'); 
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 2 ipsum');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 3 dolor');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 4 sit');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 5 amet');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 6 consectetur set amet');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 7 adipiscing');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 8 elit');
    id = this.flow.insert(path + '/assets/egSelect.png', 'Label 9 set');
    this.flow.connect('selection-changed', Lang.bind (this, function () {
        if (this.flow.selected.length > 0) {
            this.buttonDelete.set_sensitive(true);
        } else {
            this.buttonDelete.set_sensitive(false);
        }
    }));
    this.flow.connect('action', Lang.bind (this, function (id) {
        this.printText('Do something for: ' + id);
    }));

    scroll.add(this.flow.widget);

    return scroll;
};

App.prototype.getActionBar = function () {

    this.actionBar = new Gtk.ActionBar();

    this.buttonDelete = new Gtk.Button({ label: "Delete", sensitive: false });
    this.buttonDelete.connect ('clicked', Lang.bind (this, function() {
        this.printText('Will delete: ' + JSON.stringify(this.flow.selected));
        this.flow.deleteSelected();
    }));
    this.actionBar.pack_end(this.buttonDelete);

    return this.actionBar;
};

App.prototype.selectionShow = function (show) {

    this.selectionMode = show;

    if (show) {
        this.buttonSelect.hide();
        this.buttonCancel.show();
        
        this.headerBar.get_style_context().add_class('selection-mode');
        this.actionBar.show();
    } else {
        this.buttonSelect.show();
        this.buttonCancel.hide();
        this.headerBar.get_style_context().remove_class('selection-mode');
        this.actionBar.hide();
    }

    this.headerBar.set_show_close_button(!show);
    this.flow.setSelectingMode(show);
};

App.prototype.printText = function (text) {

    print(text);
};

//Run the application
let app = new App();
app.run(ARGV);
