# mMeddle Development Setup for Windows

[https://github.com/jfogarty/mmeddle][github-mm-url]

![VS](../images/dev/visual-studio-2015.jpg)
![W8](../images/dev/windows8small.jpg)

`mmeddle.js` is a symbolic math workspace for browsers and Node.js.
This guide is a cheat sheet for installing its development tools on
Windows 7 to Windows 8.1 systems.

There are a lot of tools to install, and installation of anything on Windows
is almost never a smooth process, so don't despair, others have done this before
you and lived to tell the tale.

**Before you start, you should understand that these instructions are WRONG**.
Your system is different. The path's shown will have changed. There will be
new and different dependencies. You will need to figure it out and when you
do, please push your changes back to this file.  You will save some other
poor schmoe the troubles you've just worked through and life will be better
because of it.


- Install **Node 0.10.38**. 
- Node 0.12 is NOT stable for Windows development,
because many useful tools have not been properly updated to work on it under
Windows. Use 0.10.38 and you will have an easier time.

	- http://blog.nodejs.org/2015/03/23/node-v0-10-38-maintenance/
	- http://nodejs.org/dist/v0.10.38/x64/node-v0.10.38-x64.msi
	- **Windows Installer:** node-v0.10.38-x64.msi

	
- Install Git client

	- https://git-scm.com/download/win
	- **Windows Installer:** Git-1.9.5-preview20150319.exe
	

- Run the latest 2.7.x Python installer (v3.x.x is not supported).
  
	- https://www.python.org/downloads/release/python-279/
	- **Windows Installer:** python-2.7.9.amd64.msi
	- Put the following in your shell configuration:
	- `SET PYTHON=C:\Python27`
	- `npm config set python C:\Python27\python.exe --global`
	
	
	
- Install the free Visual Studio 2013 Community Edition.
  
	- https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs
	- **Windows Installer:** vs_community.exe
	- Takes forever and is HUGE
	- Put the following lines in your shell configuration:
	- `set GYP_MSVS_VERSION=2013`
    - `call "C:\Program Files (x86)\Microsoft Visual Studio 12.0\VC\vcvarsall.bat" x86`
	- `npm config set msvs_version 2013 --global`	

	
- Install node-gyp globally with npm install -g node-gyp.

	- `npm install -g node-gyp`
	- `npm config set python C:\Python27\python.exe --global`
	- **if node-gyp rebuild fails immediately you messed up the above**
	- check with `npm config ls p*`
	
	
- MongoDB Server and Mongo command line tool

	- ** Windows Installer:** mongodb-win32-x86_64-2008plus-2.6.7.zip	
	
## Installing Image Manipulation Tools

- Install ImageMagick Image Manipulation Tools

	- **Windows Installer:** ImageMagick-6.9.1-2-Q16-x64-dll.exe

	
- Install GIMP Image Editing tools
	
	- ** Windows Installer:** gimp-2.8.10-setup.exe
	- ** Help Installer:** gimp-help-2-2.8.1-en-setup.exe
	
	
## Installing Canvas for Node on Windows	

Canvas for Node is somewhat involved since it uses Cairo which is part of
the GTK (Graphics Toolkit). This involves installing some binary libraries and
rebuilding the C++ source code via node-gyp. This is where things often go
wrong on Windows since everything needs to be in expected locations and various
environment variables need to be just so. If you are lucky this will go
smoothly, but for me these things usually fail a few times before I get the
kinks out.

Note that you do NOT need Canvas for Node to do most things with mMeddle, but
it is required if you will try to do the graphics things such as generating
equation images on the server. 

**ALSO NOTE** Canvas on Node for Windows is quite crippled and only supports
output of .png files out of the box.  I added a section to the end here for
installing the the libJPEG-turbo support.  Do this as a separate step since
it tends to go terribly wrong.
	
- First install x64 GTK 2.x in order to get Cairo

	- http://www.gtk.org/download/win64.php	
	- **Windows Installer:** gtk+_2.22.1-1_win64.zip
	- Make sure to use the bundle rather than an individual file.
	The bundle will include bin/libcairo...dll
	- Unzip to **C:\GTK**
	
	
- Install Canvas itself

	- npm install canvas
	- This install and subsequent build should look something like:

```
	> canvas@1.2.3 install D:\jf2\js\mm\node_modules\canvas
	> node-gyp rebuilds
	D:\jf2\js\mm\node_modules\canvas>node "C:\Program Files\nodejs\node_modules\npm\bin\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild

	Building the projects in this solution one at a time. To enable parallel build, please add the "/m" switch.
	  Canvas.cc
	  CanvasGradient.cc
	  CanvasPattern.cc
	  CanvasRenderingContext2d.cc
	..\src\CanvasRenderingContext2d.cc(379): warning C4189: 'surface' : local variable is initialized but not referenced [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	  color.cc
	  Image.cc
	  ImageData.cc
	  init.cc
	  PixelArray.cc
		 Creating library D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.lib and object D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.exp
	  Generating code
	  Finished generating code
	  canvas.vcxproj -> D:\jf2\js\mm\node_modules\canvas\build\Release\\canvas.node
	  Copying C:/GTK/bin/libcairo-2.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libcairo-2.dll
				. . . some more copies . . .
	canvas@1.2.3 node_modules\canvas
	└── nan@1.8.4
```	

### Adding JPEG support	

This consists of adding the correct Lib, then editing the 
`node_modules/canvas/binding.gyp` to add a build step for it, then
running npm install again to rebuild the C++ Canvas addon.

- Install the x64 bit libjpeg-turbo library

	- See also: https://github.com/Automattic/node-canvas/issues/427
	- http://sourceforge.net/projects/libjpeg-turbo/files/1.4.1
	- **Windows Installer:** libjpeg-turbo-1.4.1-vc64.exe
	- install to its default location (**C:\libjpeg-turbo64**).	

- Edit the binding.gyp file

	- cd `node_modules/canvas`
	- edit `binding.gyp`.  The WIN variables section should look like:
```			
    ['OS=="win"', {
      'variables': {
        'GTK_Root%': 'C:/GTK', # Set the location of GTK all-in-one bundle
		'libjpeg_root%': 'C:/libjpeg-turbo64',   # JF - Added 12-Jul-15
        'with_jpeg%': 'true',                    # JF - Added 12-Jul-15
        'with_gif%': 'false',
        'with_pango%': 'false',
        'with_freetype%': 'false'
      }
```	
	- in the JPEG part make it look like the following:
```	
        ['with_jpeg=="true"', {
          'defines': [
            'HAVE_JPEG'
          ],
		  'conditions': [  # JF - Added 12-Jul-15
			['OS=="win"', {
			  'libraries': [
				'-l<(libjpeg_root)/lib/jpeg-static.lib'
			  ],
			  'include_dirs': [
				'<(libjpeg_root)/include'
			  ]
			}, {
			  'libraries': [
				'-ljpeg'
			  ]
			}]	  
          ]
        }],	
```		

- Now rebuild the Canvas add-on using `npm install` from inside your newly
edited `node_modules\canvas` directory. You can safely ignore the warnings.
This should look something like:

```	
D:\jf2\js\mm\node_modules\canvas>npm install

> canvas@1.2.3 install D:\jf2\js\mm\node_modules\canvas
> node-gyp rebuild

D:\jf2\js\mm\node_modules\canvas>node "C:\Program Files\nodejs\node_modules\npm\bin\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild

Building the projects in this solution one at a time. To enable parallel build, please add the "/m" switch.
  Canvas.cc
  CanvasGradient.cc
  CanvasPattern.cc
  CanvasRenderingContext2d.cc
..\src\CanvasRenderingContext2d.cc(379): warning C4189: 'surface' : local variable is initialized but not referenced [D:\jf2\js\mm\node_modules\canva
s\build\canvas.vcxproj]
  color.cc
  Image.cc
  ImageData.cc
  init.cc
  PixelArray.cc
..\src\Image.cc(813): warning C4146: unary minus operator applied to unsigned type, result still unsigned [D:\jf2\js\mm\node_modules\canvas\build\can
vas.vcxproj]
..\src\Image.cc(664): warning C4505: 'jpeg_mem_src' : unreferenced local function has been removed [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcx
proj]
     Creating library D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.lib and object D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.exp
  Generating code
  Finished generating code
  canvas.vcxproj -> D:\jf2\js\mm\node_modules\canvas\build\Release\\canvas.node
  Copying C:/GTK/bin/libcairo-2.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libcairo-2.dll
          1 file(s) copied.
  Copying C:/GTK/bin/libfontconfig-1.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libfontconfig-1.dll
          1 file(s) copied.
  Copying C:/GTK/bin/libexpat-1.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libexpat-1.dll
          1 file(s) copied.
  Copying C:/GTK/bin/libfreetype-6.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libfreetype-6.dll
          1 file(s) copied.
  Copying C:/GTK/bin/libpng14-14.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\libpng14-14.dll
          1 file(s) copied.
  Copying C:/GTK/bin/zlib1.dll to D:\jf2\js\mm\node_modules\canvas\build\Release\\zlib1.dll
          1 file(s) copied.

D:\jf2\js\mm\node_modules\canvas>
```	

Note: If you get a bunch of unresolved externals that look like the following,
then you almost certainly have an x86/x64 mismatch somewhere.  Make sure both
your GTK and JPEGs are x64. Take a guess at how I know. The following is BAD:

```	
     Creating library D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.lib and object D:\jf2\js\mm\node_modules\canvas\build\Release\canvas.exp
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_simple_progression [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_set_quality [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_CreateCompress [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_destroy_compress [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_write_scanlines [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
	Canvas.obj : error LNK2001: unresolved external symbol jpeg_finish_compress [D:\jf2\js\mm\node_modules\canvas\build\canvas.vcxproj]
```	

## Install Browsers for Development

The browsers I had installed when I last updated this document are:

- Firefox 39.0 (my primary development browser)
	- with Firebug 2.0.11
	- Markdown Viewer 1.8.1-signed
- Chrome 43.0.2357.132 
- Opera 30.0.1835.88
- Internet Explorer 11.0.9600.17842
- PhantomJS 2.0.0 (headless test browser)

## Other Tools that may matter

I usually have Perl and Ruby installed, so I may be taking dependencies on
these that I am not aware of.


## The End.
	
  
	