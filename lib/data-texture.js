
function DataTexture(width, height) {
	this.width = width;
	this.height = height;
	this.buffer = new ArrayBuffer(width * height);
	this.arr = new Uint8Array(this.buffer);
}

DataTexture.prototype.get = function (x, y) {
	return this.arr[x + y * this.width];
};

DataTexture.prototype.set = function (x, y, value) {
	this.arr[x + y * this.width] = value;
};

DataTexture.prototype.makeTexture = function (gl) {
	var texture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, this.width, this.height, 0, gl.ALPHA, gl.UNSIGNED_BYTE, this.arr);

	return texture;
};

DataTexture.prototype.bindToUniform = function (shader, uniformName, textureIndex) {
	var gl = shader.gl;
	var program = shader.program;
	var texture = this.makeTexture(gl);
	var location = gl.getUniformLocation(program, uniformName);

	textureIndex = textureIndex || 1;

	gl.useProgram(program);
	gl.uniform1i(location, textureIndex);
	gl.activeTexture(gl['TEXTURE' + textureIndex]);
	gl.bindTexture(gl.TEXTURE_2D, texture);
};

module.exports = DataTexture;
