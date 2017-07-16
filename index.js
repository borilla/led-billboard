var now = require('gl-now');
var pp  = require('post-process');
var fs  = require('fs');
var DataTexture  = require('./lib/data-texture');

var video = document.createElement('video');

video.loop = true;
video.muted = false;
video.src = 'ExpanseSpaceBattle.mp4';
video.play();

video.addEventListener('loadeddata', function() {
	var maxFrameRate = 150; // ms
	var frameTimeout = 0;
	var shell, post;
	var pixelsX, pixelsY, pixelSize, pixelRadius, pixelFade;
	var panelSize;
	var glitchTexture;

	shell = now({ clearFlags: 0 })
		.on('gl-init', init)
		.on('gl-render', render);

	function init() {
		post = pp(shell.gl, video, fs.readFileSync(__dirname + '/shaders/led.frag', 'utf8'));

		pixelSize = 5;
		pixelRadius = 2;
		pixelFade = 1;
		panelSize = 16;
		pixelsX = Math.round(shell.canvas.width / pixelSize);
		pixelsY = Math.round(shell.canvas.height / pixelSize);
		panelsX = Math.floor(pixelsX / panelSize);
		panelsY = Math.floor(pixelsY / panelSize);
		glitchTexture = new DataTexture(pixelsX, pixelsY);

		glitchRandomPanels();
		glitchRandomPixels();
	}

	function glitchRandomPixels() {
		for (var i = 0; i < pixelsX * pixelsY * 0.01; ++i) {
			var x = Math.floor(Math.random() * pixelsX);
			var y = Math.floor(Math.random() * pixelsY);
			var glitch = Math.floor(Math.random() * 8) + 1;
			glitchTexture.set(x, y, glitch);
		}
	}

	function glitchRandomPanels() {
		for (var x = 0; x < panelsX; ++x) {
			for (var y =-0; y < panelsY; ++y) {
				var glitch = Math.floor(Math.random() * 50);
				glitchPanel(x, y, glitch);
			}
		}
	}

	function glitchPanel(panelX, panelY, glitch) {
		for (var x = panelX * panelSize; x < (panelX + 1) * panelSize; ++x) {
			for (var y = panelY * panelSize; y < (panelY + 1) * panelSize; ++y) {
				glitchTexture.set(x, y, glitch);
			}
		}
	}

	function render(time) {
		if (!frameTimeout) {
			frameTimeout = setTimeout(function () {
				frameTimeout = 0;
			}, maxFrameRate);
			renderFrame();
		}
	}

	function renderFrame() {
		var shader = post.shader;

		glitchTexture.bindToUniform(shader, 'glitches', 1);
		shader.uniforms.pixelsX = pixelsX;
		shader.uniforms.pixelsY = pixelsY;
		shader.uniforms.pixelRadius = pixelRadius;
		shader.uniforms.pixelFade = pixelFade;

		post.render(shell.width, shell.height);
	}
});
