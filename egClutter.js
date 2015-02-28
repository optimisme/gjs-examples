#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk and Clutter, showing how to drag actors with
Clutter.DragAction, perform animations with PropertyTransition,
TransitionGroup and control the actor from Gtk.Scale

Run it with:
    gjs egCairo.js
*/

const Gdk           = imports.gi.Gdk;
const Clutter       = imports.gi.Clutter;
const GtkClutter    = imports.gi.GtkClutter;
const Gio           = imports.gi.Gio;
const GLib          = imports.gi.GLib;
const Gtk           = imports.gi.Gtk;
const Lang          = imports.lang;

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
    this.title = 'Example Clutter';
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
    this.initClutter();
    this.buildUI();
};

App.prototype.initClutter = function() {

    GtkClutter.init(null, 0);
    Clutter.init(null, 0);
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              default_height: 500,
                                              default_width: 700,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    this.window.add(this.buildBody());
};

App.prototype.buildBody = function() {

    let embed, grid, titleRotate, scale, buttonStart, buttonStop;

    embed = new GtkClutter.Embed();
    embed.set_size_request(400, 240);

    this.position = new Gtk.Label({ label: 'Drag the square' });
    this.position.set_size_request(300, -1);

    titleRotate = new Gtk.Label({ label: 'Rotation: ' });
    titleRotate.set_size_request(150, -1);

    scale = new Gtk.Scale({
        digits: 1,
        draw_value: true,
        value_pos: Gtk.PositionType.LEFT
    });
    scale.set_range(-35, 35);
    scale.set_size_request(150, -1);
    scale.connect('change-value', Lang.bind(this, function(widget) {
        this.actor.set_rotation(Clutter.RotateAxis.Y_AXIS, widget.get_value(), 50, 0, 0);
    }));

    buttonStart = new Gtk.Button({ label: 'Play' });
    buttonStart.connect ('clicked', Lang.bind (this, function () {

        let tg, pt;

        pt = new Clutter.PropertyTransition({ property_name: 'rotation-angle-z' });
        pt.set_from(0);
        pt.set_to(360);
        pt.set_duration(2000);
        pt.set_progress_mode(Clutter.AnimationMode.LINEAR);

        tg = new Clutter.TransitionGroup();
        tg.set_duration(2000);
        tg.set_repeat_count(-1); // Infinite
        tg.add_transition(pt);
        // Add more property transitions ...
        
        this.actor.add_transition('rotate_transition', tg);

        scale.set_sensitive(false);
        buttonStart.set_sensitive(false);
        buttonStop.set_sensitive(true);
    }));

    buttonStop = new Gtk.Button({ label: 'Stop', sensitive: false });
    buttonStop.connect ('clicked', Lang.bind (this, function () {

        this.actor.remove_transition('rotate_transition');
        this.actor.set_rotation_angle(Clutter.RotateAxis.Z_AXIS, 0);

        scale.set_sensitive(true);
        buttonStart.set_sensitive(true);
        buttonStop.set_sensitive(false);
    }));

    grid = new Gtk.Grid({ column_spacing: 6, margin: 15, row_spacing: 6 });
    grid.attach(embed, 0, 0, 1, 3);
    grid.attach(this.position, 1, 0, 2, 1);
    grid.attach(titleRotate, 1, 1, 1, 1);
    grid.attach(scale, 2, 1, 1, 1);
    grid.attach(buttonStart, 1, 2, 1, 1);
    grid.attach(buttonStop, 2, 2, 1, 1);
    
    this.stage = embed.get_stage();
    this.stage.set_color(new Clutter.Color({ red: 255, green: 255, blue: 255, alpha: 255 }));
    this.stage.add_child(this.getActor());

    return grid;
};

App.prototype.getActor = function() {

    let colorDark, colorLight, action;

    colorDark = new Clutter.Color({ red: 100, green: 125, blue: 100, alpha: 255 });
    colorLight = new Clutter.Color({ red: 150, green: 175, blue: 150, alpha: 255 });

    action = new Clutter.DragAction({
        drag_axis: Clutter.DragAxis.AXIS_NONE,
        x_drag_threshold: 0,
        y_drag_threshold: 0
    });
    action.connect('drag-begin', Lang.bind(this, function(action, actor, x, y, modifiers) {
        this.position.set_text('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - S');
    }));
    action.connect('drag-end', Lang.bind(this, function(action, actor, x, y, modifiers) {
        this.position.set_text('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - E');
    }));
    action.connect('drag-motion', Lang.bind(this, function(action, actor, x, y, modifiers) {
        this.position.set_text('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - D');
    }));
    /* 
    // Simple actor example:
    this.actor = new Clutter.Actor({
        background_color: colorDark,
        x: 150, y: 150,
        height: 100, width: 100
    });
    */
    // Textured actor example
    this.actor = new Clutter.Texture({
        background_color: colorDark,
        filename: path + '/assets/egClutter.png',
        height: 100,
        reactive: true,
        x: 150,
        y: 150,
        width: 100
    });
    this.actor.connect('enter-event', Lang.bind(this, function(actor, event) {
        actor.set_background_color(colorLight);

    }));
    this.actor.connect('leave-event', Lang.bind(this, function(actor, event) {
        actor.set_background_color(colorDark);
    }));
    this.actor.add_action(action);

    

    return this.actor;
};

//Run the application
let app = new App();
app.run(ARGV);
