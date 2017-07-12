precision mediump float;

uniform float width;
uniform float height;
uniform sampler2D map;
uniform float pixelSize;

float limitColor(float value) {
	const float resolution = 6.0;
	return floor(value * resolution) / resolution;
}

vec4 limitColor(vec3 color) {
	float r = limitColor(color.r);
	float g = limitColor(color.g);
	float b = limitColor(color.b);
	return vec4(r, g, b, 1);
}

vec3 increaseBrightness(vec3 color) {
	const float factor = 1.6;
	float r = color.r * factor;
	float g = color.g * factor;
	float b = color.b * factor;
	return vec3(r, g, b);
}

void main() {
	vec2 pixel = vec2(gl_FragCoord.x, height - gl_FragCoord.y);

	if ((mod(pixel.x, pixelSize) < 2.0) || (mod(pixel.y, pixelSize) < 2.0)) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	else {
		vec2 pixels = vec2(width / pixelSize, height / pixelSize);
		vec2 position = vec2(pixel.x / width, pixel.y / height);
		vec2 samplePos;

		samplePos.x = floor(position.x * pixels.x) / pixels.x;
		samplePos.y = floor(position.y * pixels.y) / pixels.y;

		vec3 color = texture2D(map, samplePos).rgb;

		gl_FragColor = limitColor(increaseBrightness(color));
	}
}
