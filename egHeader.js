#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, and Popover buttons with Gtk Widget or Gio GMenu.

GMenu includes examples of sections, submenus, checkboxes and selections

Run it with:
    gjs egHeader.js
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

const PopWidget = function (label, widget) {

    let image = new Gtk.Image ({ icon_name: 'pan-down-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });

    this.pop = new Gtk.Popover();
    this.button = new Gtk.ToggleButton({ label: label });
    this.button.set_image(image);
    this.button.set_always_show_image(true);
    this.button.set_image_position(Gtk.PositionType.RIGHT);
    this.button.connect ('clicked', Lang.bind (this, function () { if (this.button.get_active()) { this.pop.show_all(); }}));
    this.pop.connect ('closed', Lang.bind (this, function () { if (this.button.get_active()) { this.button.set_active(false); }}));
    this.pop.set_relative_to(this.button);
    this.pop.set_size_request(-1, -1);
    this.pop.set_border_width(8);
    this.pop.add(widget);
};

const App = function () { 
    this.title = 'Example Header';
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
                                              default_height: 300,
                                              default_width: 720,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.set_titlebar(this.getHeader());

    this.label = new Gtk.Label({ label: "..." });
    this.window.add(this.label);
};

App.prototype.getHeader = function () {

    let headerBar, headerStart, imageNew, buttonNew, popMenu, imageMenu, buttonMenu;

    headerBar = new Gtk.HeaderBar();
    headerBar.set_title("Window Title");
    headerBar.set_subtitle("Some subtitle text here");
    headerBar.set_show_close_button(true);

    headerStart = new Gtk.Grid();
    headerStart.set_column_spacing(headerBar.spacing);

    this.widgetOpen = new PopWidget("Open", this.getPopOpen());

    imageNew = new Gtk.Image ({ icon_name: 'tab-new-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    buttonNew = new Gtk.Button({ image: imageNew });
    buttonNew.connect ('clicked', Lang.bind (this, function () { this.printText('Button new'); }));

    headerStart.attach(this.widgetOpen.button, 0, 0, 1, 1);
    headerStart.attach(buttonNew, 1, 0, 1, 1);
    headerBar.pack_start(headerStart);

    popMenu = new Gtk.Popover();
    imageMenu = new Gtk.Image ({ icon_name: 'open-menu-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    buttonMenu = new Gtk.MenuButton({ image: imageMenu });
    buttonMenu.set_popover(popMenu);
    popMenu.set_size_request(-1, -1);
    buttonMenu.set_menu_model(this.getMenu());

    headerBar.pack_end(buttonMenu);

    return headerBar;
};

App.prototype.getPopOpen = function () { /* Widget popover */

    let widget = new Gtk.Grid(),
        label = new Gtk.Label({ label: "Label 1" }),
        button = new Gtk.Button({ label: "Other Documents ..." });

    button.connect ('clicked', Lang.bind (this, function () { 
        this.widgetOpen.pop.hide();
        this.printText('Open other documents');
    }));
    button.set_size_request(200, -1);

    widget.attach(label, 0, 0, 1, 1);
    widget.attach(button, 0, 1, 1, 1);
    widget.set_halign(Gtk.Align.CENTER);

    return widget;
};

App.prototype.getMenu = function () { /* GMenu popover */

    let menu, section, submenu;

    menu = new Gio.Menu();

    section = new Gio.Menu();
    section.append("Save As...", 'app.saveAs');
    section.append("Save All", 'app.saveAll');
    menu.append_section(null, section);

    section = new Gio.Menu();
    submenu = new Gio.Menu();
    section.append_submenu('View', submenu);
    submenu.append("View something", 'app.toggle');
    submenu = new Gio.Menu();
    section.append_submenu('Select', submenu);
    submenu.append("Selection 1", 'app.select::one');
    submenu.append("Selection 2", 'app.select::two');
    submenu.append("Selection 3", 'app.select::thr');
    menu.append_section(null, section);

    section = new Gio.Menu();
    section.append("Close All", 'app.close1');
    section.append("Close", 'app.close2');
    menu.append_section(null, section);

    // Set menu actions
    let actionSaveAs = new Gio.SimpleAction ({ name: 'saveAs' });
        actionSaveAs.connect('activate', Lang.bind(this,
            function() {
                this.printText('Action save as');
            }));
        this.application.add_action(actionSaveAs);

    let actionSaveAll = new Gio.SimpleAction ({ name: 'saveAll' });
        actionSaveAll.connect('activate', Lang.bind(this,
            function() {
                this.printText('Action save all');
            }));
        this.application.add_action(actionSaveAll);

    let actionClose1 = new Gio.SimpleAction ({ name: 'close1' });
        actionClose1.connect('activate', Lang.bind(this,
            function() {
                this.printText('Action close all');
            }));
        this.application.add_action(actionClose1);

    let actionClose2 = new Gio.SimpleAction ({ name: 'close2' });
        actionClose2.connect('activate', Lang.bind(this,
            function() {
                this.printText('Action close');
            }));
        this.application.add_action(actionClose2);

    let actionToggle = new Gio.SimpleAction ({ name: 'toggle', state: new GLib.Variant('b', true) });
        actionToggle.connect('activate', Lang.bind(this,
            function(action) {
                let state = action.get_state().get_boolean();
                if (state) {
                    action.set_state(new GLib.Variant('b', false));
                } else {
                    action.set_state(new GLib.Variant('b', true));
                }
                this.printText('View ' + state);
            }));
        this.application.add_action(actionToggle);

    let variant = new GLib.Variant('s', 'one');
    let actionSelect = new Gio.SimpleAction ({ name: 'select', state: variant, parameter_type: variant.get_type() });
        actionSelect.connect('activate', Lang.bind(this,
            function(action, parameter) {
                let str = parameter.get_string()[0];
                if (str === 'one') {
                    action.set_state(new GLib.Variant('s', 'one'));
                }
                if (str === 'two') {
                    action.set_state(new GLib.Variant('s', 'two'));
                }
                if (str === 'thr') {
                    action.set_state(new GLib.Variant('s', 'thr'));
                }
                this.printText('Selection ' + str);
            }));
        this.application.add_action(actionSelect);

    return menu;
};

App.prototype.printText = function (text) {

    print(text);
};

//Run the application
let app = new App();
app.run(ARGV);
