#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
adding an option to the application's Gio.Menu and opening 
dialog and modal windows using Gtk.Dialog

Run it with:
    gjs egDialog.js
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
    this.title = 'Example Dialog';
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
    this.initMenu();
    this.buildUI();
};

App.prototype.initMenu = function() {

    let menu, section, dialogAction, modalAction, quitAction;

    menu = new Gio.Menu();

    section = new Gio.Menu();
    section.append("Dialog", 'app.dialog');
    menu.append_section(null, section);

    section = new Gio.Menu();
    section.append("Modal", 'app.modal');
    menu.append_section(null, section);

    section = new Gio.Menu();
    section.append("Quit",'app.quit');
    menu.append_section(null, section);

    dialogAction = new Gio.SimpleAction ({ name: 'dialog' });
    dialogAction.connect('activate', Lang.bind(this, this.showDialog));
    this.application.add_action(dialogAction);

    modalAction = new Gio.SimpleAction ({ name: 'modal' });
    modalAction.connect('activate', Lang.bind(this, this.showModal));
    this.application.add_action(modalAction);

    quitAction = new Gio.SimpleAction ({ name: 'quit' });
    quitAction.connect('activate', Lang.bind(this, function() {
        this.window.destroy();
    }));
    this.application.add_action(quitAction);

    this.application.set_app_menu(menu);
};

App.prototype.buildUI = function() {

    let result = false;

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              default_height: 300,
                                              default_width: 500,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let label;

    label = new Gtk.Label({ label: "Open the '" + this.title + "' application menu and click on 'Dialog' or 'Modal'" });
    label.set_line_wrap(true);
    label.set_lines(5);

    return label;
};

App.prototype.showDialog = function() {

    let label, dialog, contentArea;

    label = new Gtk.Label({
        label: "Hello 'Dialog'!",
        vexpand: true
    });

    dialog = new Gtk.Dialog({ 
        default_height: 200,
        default_width: 200,
        modal: false,
        transient_for: this.window,
        title: 'Dialog',
        use_header_bar: true
    });

    dialog.connect('response', function() {
        dialog.destroy();
    });

    contentArea = dialog.get_content_area();
    contentArea.add(label);

    dialog.show_all();
};

App.prototype.showModal = function() {

    let label, modal, contentArea, button, actionArea;

    label = new Gtk.Label({
        label: "Hello 'Modal'!",
        vexpand: true
    });

    modal = new Gtk.Dialog({ 
        default_height: 200,
        default_width: 200,
        modal: true,
        transient_for: this.window,
        title: 'Modal',
        use_header_bar: false
    });

    modal.connect('response', function() {
        modal.destroy();
    });

    contentArea = modal.get_content_area();
    contentArea.add(label);

    button = Gtk.Button.new_from_stock (Gtk.STOCK_OK);
    button.connect ("clicked", Lang.bind (this, function() {
        print('OK pressed');
        modal.destroy();
    }));

    actionArea = modal.get_action_area();
    actionArea.add(button);

    modal.show_all();
};

//Run the application
let app = new App();
app.run(ARGV);
