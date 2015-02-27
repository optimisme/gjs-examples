# gjs-examples
GJS examples showing how to build Gtk javascript applications (for Gnome).

### Run

Download this project with:

git clone https://github.com/optimisme/gjs-examples.git

cd gjs-examples

Then run the examples with:

gjs egAsset.js

gjs egHeader.js

gjs egList.js

gjs egSearch.js

...

### egAsset.js

GJS example showing how to build Gtk javascript applications
using Gtk.Image

![egAsset1](https://raw.github.com/optimisme/gjs-examples/master/captures/egAsset1.png)

### egIcon.js

GJS example showing how to build Gtk javascript applications
setting the application icon from the 'assets' folder and if
not available from the 'stock icons'

![egIcon1](https://raw.github.com/optimisme/gjs-examples/master/captures/egIcon1.png)
![egIcon2](https://raw.github.com/optimisme/gjs-examples/master/captures/egIcon2.png)

### egCss.js

GJS example showing how to build Gtk javascript applications
using Gtk.CssProvider from source code or from loaded .css files

![egCss1](https://raw.github.com/optimisme/gjs-examples/master/captures/egCss1.png)

### egJustify.js

GJS example showing how to build Gtk javascript applications
using Gtk.Label and its justification options

![egJustify1](https://raw.github.com/optimisme/gjs-examples/master/captures/egJustify1.png)

### egTimers.js

GJS example showing how to build Gtk javascript applications
emulating setTimeout, clearTimeout, setInterval and clearInterval
functions with Mainloop timeout_add. It also shows how to import
and use an application library

![egTimers1](https://raw.github.com/optimisme/gjs-examples/master/captures/egTimers1.png)

### egEvent.js

GJS example showing how to build Gtk javascript applications
using Gtk.EventBox to catch events for widgets which do not 
have their own window

![egEvent1](https://raw.github.com/optimisme/gjs-examples/master/captures/egEvent1.png)

### egInfo.js

GJS example showing how to build Gtk javascript applications
getting information from GLib and command line

![egInfo1](https://raw.github.com/optimisme/gjs-examples/master/captures/egInfo1.png)

### egDialog.js

GJS example showing how to build Gtk javascript applications
adding an option to the application's Gio.Menu and opening 
dialog and modal windows using Gtk.Dialog

![egDialog1](https://raw.github.com/optimisme/gjs-examples/master/captures/egDialog1.png)
![egDialog2](https://raw.github.com/optimisme/gjs-examples/master/captures/egDialog2.png)
![egDialog3](https://raw.github.com/optimisme/gjs-examples/master/captures/egDialog3.png)

### egSpawn.js

GJS example showing how to build Gtk javascript applications
executing a non blocking command line call, it uses
TextBuffer, TextView, GLib.spawn_async_with_pipes,
Gio.UnixInputStream, Gio.DataInputStream and read_line_async

![egSpawn1](https://raw.github.com/optimisme/gjs-examples/master/captures/egSpawn1.png)

### egList.js

GJS example showing how to build Gtk javascript applications
using Gtk TreeView and ListStore

![egList1](https://raw.github.com/optimisme/gjs-examples/master/captures/egList1.png)

### egJSON.js

GJS example showing how to build Gtk javascript applications
reading and writting JSON files, the example makes use of
Gio.File.new_for_path, replace_async, load_contents_async

![egJSON1](https://raw.github.com/optimisme/gjs-examples/master/captures/egJSON1.png)

### egOpen.js

GJS example showing how to build Gtk javascript applications
with FileChooserDialog with FileFilter, set_extra_widget (ComboBox),
Gio File new_for_path, load_contents_async, query_info_async

![egOpen1](https://raw.github.com/optimisme/gjs-examples/master/captures/egOpen1.png)
![egOpen2](https://raw.github.com/optimisme/gjs-examples/master/captures/egOpen2.png)

### egHeader.js

GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, and Popover buttons with Gtk Widget or Gio GMenu.

![egHeader1](https://raw.github.com/optimisme/gjs-examples/master/captures/egHeader1.png)
![egHeader2](https://raw.github.com/optimisme/gjs-examples/master/captures/egHeader2.png)

### egSearch.js

GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar and a filtered FlowBox

![egSearch1](https://raw.github.com/optimisme/gjs-examples/master/captures/egSearch1.png)

### egSelect.js

GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar, ActionBar, a filtered FlowBox,
an application library and custom widgets to create a selection
mode

![egSelect1](https://raw.github.com/optimisme/gjs-examples/master/captures/egSelect1.png)
![egSelect2](https://raw.github.com/optimisme/gjs-examples/master/captures/egSelect2.png)

### egClutter.js

GJS example showing how to build Gtk javascript applications
using Gtk and Clutter, showing how to drag actors with
Clutter.DragAction, perform animations with Glutter.Transition
and control the actor from Gtk.Scale

![egClutter1](https://raw.github.com/optimisme/gjs-examples/master/captures/egClutter1.png)

### egWebmsg.js

GJS example showing how to build Gtk javascript applications
using Webkit.WebView, also showing how to send messages from GTK
to Webkit and vice versa

![egWebmsg1](https://raw.github.com/optimisme/gjs-examples/master/captures/egWebmsg1.png)
