precision mediump float;

uniform float width;
uniform float height;
uniform sampler2D map;
uniform float pixelSize;

void main() {
	vec2 pixel = vec2(gl_FragCoord.x, height - gl_FragCoord.y);

	if ((mod(pixel.x, pixelSize) < 1.0) || (mod(pixel.y, pixelSize) < 1.0)) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	else {
		vec2 pixels = vec2(width / pixelSize, height / pixelSize);
		vec2 position = vec2(pixel.x / width, pixel.y / height);
		vec2 samplePos;

		samplePos.x = floor(position.x * pixels.x) / pixels.x;
		samplePos.y = floor(position.y * pixels.y) / pixels.y;

		vec3 color = texture2D(map, samplePos).rgb;

		gl_FragColor = vec4(color, 1.0);
	}
}
