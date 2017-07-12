precision mediump float;

uniform float width;
uniform float height;
uniform sampler2D map;
uniform float pixelSize;

void main() {
	vec2 position = vec2(gl_FragCoord.x / width, 1.0 - gl_FragCoord.y / height);
	vec2 samplePos;

	samplePos.x = floor(position.x * (width / pixelSize)) / (width / pixelSize);
	samplePos.y = floor(position.y * (height / pixelSize)) / (height / pixelSize);

	vec3 color = texture2D(map, samplePos).rgb;

	gl_FragColor = vec4(color, 1.0);
}
