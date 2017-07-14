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

	function getShaderCode() {
		var code = fs.readFileSync(__dirname + '/shaders/led.frag', 'utf8');
		return code;
	}

	function init() {
		post = pp(shell.gl, image, getShaderCode());
	}

	function render() {
		var pixelSize = 5;
		var pixelRadius = 3;
		var pixelFade = 2;
		var pixelsX = Math.round(shell.canvas.width / pixelSize);
		var pixelsY = Math.round(shell.canvas.height / pixelSize);

		addIntArrayUniform(post.shader, 'pixelGlitches', [
			1,1,2,3,4,5,6,7,8,9
		]);
		post.shader.uniforms.pixelsX = pixelsX;
		post.shader.uniforms.pixelsY = pixelsY;
		post.shader.uniforms.pixelRadius = pixelRadius;
		post.shader.uniforms.pixelFade = pixelFade;


		post.render(shell.width, shell.height);
	}

	function addIntArrayUniform(shader, name, values) {
		var gl = shader.gl;
		var program = shader.program;
		var location = gl.getUniformLocation(program, name);

		gl.useProgram(program);
		gl.uniform1iv(location, values);
	}
});
