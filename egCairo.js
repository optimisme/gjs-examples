#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk and Cairo, the left example adds one Cairo actor to
Clutter, the example on the right adds one Cairo widget to GTK

Run it with:
    gjs egCairo.js
*/
const Cairo         = imports.cairo;
const Clutter       = imports.gi.Clutter;
const Gdk           = imports.gi.Gdk;
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
    this.title = 'Example Cairo';
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

    let grid, embed, area, actor, widget, stage;

    embed = new GtkClutter.Embed();
    embed.set_size_request(400, 500);

    area = new Gtk.DrawingArea();
    area.set_size_request(300, 500);
    area.connect('draw', Lang.bind(this, this.drawRed));
    
    grid = new Gtk.Grid({ column_spacing: 6, margin: 15, row_spacing: 6 });
    grid.attach(embed, 0, 0, 1, 1);
    grid.attach(area, 1, 0, 1, 1);

    stage = embed.get_stage();
    stage.set_color(new Clutter.Color({ red: 255, green: 255, blue: 255, alpha: 255 }));
    stage.add_child(this.getClutterActor());

    return grid;
};

App.prototype.getClutterActor = function() {

    let canvas, actor;

    canvas = new Clutter.Canvas({
        height: 100,
        width: 100
    });
    canvas.set_size(100,100);
    canvas.connect('draw', Lang.bind(this, this.drawGreen));
    canvas.invalidate();

    actor = new Clutter.Actor({
        x: 150, y: 150,
        height: 100, width: 100
    });
    actor.set_content(canvas);

    return actor;
};

App.prototype.drawRed = function(area, ctx) {

    // area is Gtk.DrawingArea
    // ctx is Cairo.Context

    let height, width;

    height = area.get_allocated_height();
    width = area.get_allocated_width();

    this.draw(ctx, height, width, 'red');
};

App.prototype.drawGreen = function(canvas, ctx) {

    // canvas is Clutter.Canvas
    // ctx is Cairo.Context

    let height, width;

    height = canvas.height;
    width = canvas.width;

    this.draw(ctx, height, width, 'green');
};

App.prototype.draw = function(ctx, height, width, color) {

    let xc, yc;

    xc = width / 2;
    yc = height / 2;

    ctx.save();
    if (color === 'red') {
        // Set black background for 'red'
        ctx.setSourceRGBA(0, 0, 0, 1);
    } else {
        // Set white background
        ctx.setSourceRGBA(1, 1, 1, 1);
    }
    ctx.paint();
    ctx.restore();

    if (color === 'red') {
        ctx.setSourceRGBA(1, 0, 0, 1);
    } else {
        ctx.setSourceRGBA(0, 0.5, 0, 1);
    }

    ctx.moveTo(0, 0);
    ctx.lineTo(xc, yc);
    ctx.lineTo(0, height);
    ctx.moveTo(xc, yc);
    ctx.lineTo(width, yc);
    ctx.stroke();

    return false;
};

//Run the application
let app = new App();
app.run(ARGV);

