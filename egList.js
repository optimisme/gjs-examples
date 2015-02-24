#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk TreeView and ListStore

Run it with:
    gjs egList.js
*/

const GObj  = imports.gi.GObject;
const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;

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
};

App.prototype.onStartup = function() {

    this.buildUI();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application });
    this.window.set_default_size(720, 300);

    this.window.set_titlebar(this.getHeader());
    this.window.add(this.getBody());
};

App.prototype.getHeader = function () {

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.set_show_close_button(true);
    return this.headerBar;
};

App.prototype.getBody = function () {

    let scroll, store, tree, col;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });

    store = new Gtk.ListStore();
    store.set_column_types([GObj.TYPE_INT, GObj.TYPE_STRING, GObj.TYPE_STRING, GObj.TYPE_BOOLEAN]);
    store.set(store.append(), [0, 1, 2, 3], [0, '0A', 'Name 0', false]);
    store.set(store.append(), [0, 1, 2, 3], [1, '1B', 'Name 1', false]);
    store.set(store.append(), [0, 1, 2, 3], [2, '2C', 'Name 2', false]);
    store.set(store.append(), [0, 1, 2, 3], [3, '3D', 'Name 3', false]);

    tree = new Gtk.TreeView({ headers_visible: false, vexpand: true, hexpand: true });
    tree.set_model(store);  
    scroll.add(tree);

    col = new Gtk.TreeViewColumn();
    tree.append_column(col);

    let text1 = new Gtk.CellRendererText();
    col.pack_start(text1, true);
    col.set_cell_data_func(text1, Lang.bind(this, this.cellFuncText1));

    let text2 = new Gtk.CellRendererText();
    col.pack_start(text2, true);
    col.set_cell_data_func(text2, Lang.bind(this, this.cellFuncText2));

    return scroll;
};

App.prototype.cellFuncText1 = function (col, cell, model, iter) {
    cell.editable = false;
    cell.text = model.get_value(iter, 1);
};

App.prototype.cellFuncText2 = function (col, cell, model, iter) {
    cell.editable = false;
    cell.text = model.get_value(iter, 2);
};

//Run the application
let app = new App();
app.run(ARGV);
