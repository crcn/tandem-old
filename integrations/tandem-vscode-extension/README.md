### Tandem VSCode Sync Extension (Alpha)

This is a visual programming extension for VSCode that enables you to see your HTML/CSS/JS code changes *as* you're writing code. 

### Getting started

1. Install Tandem (if you're part of the closed beta program).
2. Install *this* extension in VSCode (just search for "Tandem").
3. Open any HTML file in VSCode, and run the **"Open current file in new Tandem window"** command.

You're done! Tandem will execute your HTML/CSS/JS code like a normal browser. Any changes that you make in VSCode will automatically
synchronize with Tandem, and vice versa. 

<!--### Opening files in Tandem from VSCode

You can open any file in VSCode in a new Tandem window by running cmd+p in VSCode, and selecting **"Open current file in new Tandem window"**.
If you're looking to open a file in an *existing* window, then you can simply drag & drop any file you into Tandem.  

![command](https://cloud.githubusercontent.com/assets/757408/21056883/08751b3c-bdfd-11e6-9a7a-38863213970e.gif)

-->

### Drag & drop files from VSCode directly into Tandem

Drag and drop any HTML file into Tandem to create a new Artboard. You can even drag & drop the same document *multiple* times to produce
multiple Artboards that can be used for responsive testing. 

![dnd](https://cloud.githubusercontent.com/assets/757408/21056888/0ad329dc-bdfd-11e6-89e5-63ab1afd1503.gif)

### Realtime changes between VSCode and Tandem

No setup required if you're using HTML & CSS - this extension will automatically detect when Tandem running. Just start typing, and changes will automatically
synchronize between editors. 

If you're using other languages such as JSX, SASS, PHP, Less, or others, then you'll need to add some additional configuration to help Tandem properly map & edit your 
source code. More documentation on that soon. 

![syncing](https://cloud.githubusercontent.com/assets/757408/21056884/08d42eec-bdfd-11e6-9b47-aa4223f7e75f.gif)

### cmd/ctrl+click any element in Tandem to reveal its source code in VSCode

Works with HTML & CSS out of the box. You'll need to turn on source maps if you're using other languages such as SASS, and LESS.  

![cmd click](https://cloud.githubusercontent.com/assets/757408/21056829/df3cf3ca-bdfc-11e6-86e0-56ab46a194d1.gif)

