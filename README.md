# led-billboard

Display image or video content as if on a (slightly glitched) LED billboard

## About

Ever since moving to Taiwan I've been fascinated by the ubiquitous super-bright animated street advertising. Perversely, one of the things I find particularly interesting is the way that none of them is quite perfect; they all have little defects and glitches

I decided I'd like to try to replicate something like it on the web. It was also a good excuse to learn a bit about **WebGL** and **fragment shaders**, which I've never used before

## Process

The development process was effectively a series of steps as follows:

* Pixellate image
* Brigthen colors
* Reduce color depth
* Make pixels rounded
* Add glitches to random pixels
* Add random glitches to panels

The images below show the results of each of these stages:

<img src="https://github.com/borilla/led-billboard/raw/master/doc/can-original.jpg" alt="Original image" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-pixellated.jpg" alt="Pixellate image" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-brightened.jpg" alt="Brighten colors" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-reduce-colors.jpg" alt="Reduce color depth" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-round-pixels.jpg" alt="Make pixels rounded" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-glitch-pixels.jpg" alt="Add glitches to random pixels" height="300"> <img src="https://github.com/borilla/led-billboard/raw/master/doc/can-glitch-panels.jpg" alt="Add random glitches to panels" height="300">

## Try it out

Clone the repo and try out some different parameters/images/videos. At the moment it just creates a fullscreen canvas and renders onto there. I'm hoping to make it a bit more interactive in the future

```sh
# clone the repo
git clone https://github.com/borilla/led-billboard.git

# switch into the new directory
cd led-billboard

# install packages
npm install

# start local dev server
npm start

# open the displayed url in your browser
```

## Thanks

The code uses [post-process](https://www.npmjs.com/package/post-process) and is based very much on [demo.js](https://github.com/hughsk/post-process/blob/master/demo.js) from that project

I copied some tips from this [Led Shader Tutorial](http://www.lighthouse3d.com/opengl/ledshader/), which is doing something very similar to what I wanted to do
