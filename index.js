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

		var glitchTexture = makeGlitchTexture(post.gl, pixelsX, pixelsY);
		addTextureUniform(post.shader, 'glitches', glitchTexture);

		post.shader.uniforms.pixelsX = pixelsX;
		post.shader.uniforms.pixelsY = pixelsY;
		post.shader.uniforms.pixelRadius = pixelRadius;
		post.shader.uniforms.pixelFade = pixelFade;


		post.render(shell.width, shell.height);
	}

	function addTextureUniform(shader, name, texture) {
		var index = 1;
		var gl = shader.gl;
		var program = shader.program;
		var location = gl.getUniformLocation(program, name);

		gl.useProgram(program);
		gl.uniform1i(location, index);
		gl.activeTexture(gl['TEXTURE' + index]);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	}

	function addIntArrayUniform(shader, name, values) {
		var gl = shader.gl;
		var program = shader.program;
		var location = gl.getUniformLocation(program, name);

		gl.useProgram(program);
		gl.uniform1iv(location, values);
	}
});

function makeGlitchTexture(gl, pixelsX, pixelsY) {
	var buffer = new ArrayBuffer(pixelsX * pixelsY * 4);
	var arr = new Uint8Array(buffer);
	var texture = gl.createTexture();
	var i;

	for (i = 0; i < pixelsX * pixelsY * 4; i += 4) {
		arr[i + 3] = i % 255;
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, arr);

	return texture;
}
