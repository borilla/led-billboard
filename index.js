var now = require('gl-now');
var pp  = require('post-process');
var fs  = require('fs');
var DataTexture  = require('./lib/data-texture');

var image = document.createElement('img');

image.src = 'can.jpg';

image.addEventListener('load', function() {
	var shell, post;
	var pixelsX, pixelsY, pixelSize, pixelRadius, pixelFade;
	var panelSize;
	var glitchTexture;

	shell = now({ clearColor: [0, 0, 0, 1] })
		.on('gl-init', init)
		.on('gl-render', render);

	function init() {
		post = pp(shell.gl, image, fs.readFileSync(__dirname + '/shaders/led.frag', 'utf8'));

		pixelSize = 5;
		pixelRadius = 3;
		pixelFade = 2;
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
		for (var i = 0; i < pixelsX * pixelsY * 0.02; ++i) {
			var x = Math.floor(Math.random() * pixelsX);
			var y = Math.floor(Math.random() * pixelsY);
			var glitch = Math.floor(Math.random() * 8) + 1;
			glitchTexture.set(x, y, glitch);
		}
	}

	function glitchRandomPanels() {
		for (var x = 0; x < panelsX; ++x) {
			for (var y =-0; y < panelsY; ++y) {
				var glitch = Math.floor(Math.random() * 16);
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

	function render() {
		var shader = post.shader;

		glitchTexture.bindToUniform(shader, 'glitches', 1);
		shader.uniforms.pixelsX = pixelsX;
		shader.uniforms.pixelsY = pixelsY;
		shader.uniforms.pixelRadius = pixelRadius;
		shader.uniforms.pixelFade = pixelFade;

		post.render(shell.width, shell.height);
	}
});
