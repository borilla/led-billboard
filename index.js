var now = require('gl-now');
var pp  = require('post-process');
var fs  = require('fs');
var DataTexture  = require('./lib/data-texture');

var image = document.createElement('img');

image.src = 'can.jpg';

image.addEventListener('load', function() {
	var shell, post;
	var pixelSize, pixelRadius, pixelFade;
	var pixelsX, pixelsY, glitchTexture;

	shell = now({ clearColor: [0, 0, 0, 1] })
		.on('gl-init', init)
		.on('gl-render', render);

	function getShaderCode() {
		var code = fs.readFileSync(__dirname + '/shaders/led.frag', 'utf8');
		return code;
	}

	function init() {
		post = pp(shell.gl, image, getShaderCode());

		pixelSize = 5;
		pixelRadius = 3;
		pixelFade = 2;
		pixelsX = Math.round(shell.canvas.width / pixelSize);
		pixelsY = Math.round(shell.canvas.height / pixelSize);
		glitchTexture = new DataTexture(pixelsX, pixelsY);

		for (var i = 0; i < pixelsX * pixelsY * 0.05; ++i) {
			var x = Math.floor(Math.random() * pixelsX);
			var y = Math.floor(Math.random() * pixelsY);
			var glitch = Math.floor(Math.random() * 5) + 1;
			glitchTexture.set(x, y, glitch);
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
