var now = require('gl-now');
var pp  = require('post-process');
var fs  = require('fs');

var image = document.createElement('img');

image.src = 'can.jpg';

image.addEventListener('load', function() {
	var shell, post;

	shell = now({ clearColor: [0, 0, 0, 1] })
		.on('gl-init', init)
		.on('gl-render', render);

	function init() {
		post = pp(shell.gl, image, fs.readFileSync(__dirname + '/shaders/led.frag', 'utf8'));
	}

	function render() {
		post.shader.uniforms.pixelSize = 8;
		post.render(shell.width, shell.height);
	}
});
