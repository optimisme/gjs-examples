# gjs-examples
GJS examples showing how to build Gtk javascript applications

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

### egList.js

GJS example showing how to build Gtk javascript applications
using Gtk TreeView and ListStore

![egList1](https://raw.github.com/optimisme/gjs-examples/master/captures/egList1.png)

### egHeader.js

GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, and Popover buttons with Gtk Widget or Gio GMenu.

![egHeader1](https://raw.github.com/optimisme/gjs-examples/master/captures/egHeader1.png)
![egHeader2](https://raw.github.com/optimisme/gjs-examples/master/captures/egHeader2.png)

### egSearch.js

GJS example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar, ActionBar and a filtered FlowBox

![egSearch1](https://raw.github.com/optimisme/gjs-examples/master/captures/egSearch1.png)

### egSpawn.js

GJS example showing how to build Gtk javascript applications
executing a non blocking command line call, it uses
TextBuffer, TextView, GLib.spawn_async_with_pipes,
Gio.UnixInputStream, Gio.DataInputStream and read_line_async

![egSpawn1](https://raw.github.com/optimisme/gjs-examples/master/captures/egSpawn1.png)

### egTimers.js

GJS example showing how to build Gtk javascript applications
emulating setTimeout, clearTimeout, setInterval and clearInterval
functions with Mainloop timeout_add. It also shows how to import
and use an application library

![egTimers1](https://raw.github.com/optimisme/gjs-examples/master/captures/egTimers1.png)

### egOpen.js

GJS example showing how to build Gtk javascript applications
with FileChooserDialog with FileFilter, set_extra_widget (ComboBox),
Gio File new_for_path, load_contents_async, query_info_async

![egOpen1](https://raw.github.com/optimisme/gjs-examples/master/captures/egOpen1.png)
![egOpen2](https://raw.github.com/optimisme/gjs-examples/master/captures/egOpen2.png)

### egInfo.js

GJS example showing how to build Gtk javascript applications
getting information from GLib and command line

![egInfo1](https://raw.github.com/optimisme/gjs-examples/master/captures/egInfo1.png)
