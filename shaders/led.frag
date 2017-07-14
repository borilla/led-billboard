precision mediump float;

uniform float width;
uniform float height;
uniform sampler2D map;

uniform float pixelsX;
uniform float pixelsY;
uniform float pixelRadius;
uniform float pixelFade;
uniform int pixelGlitches[10];

float limitColor(float value) {
	const float resolution = 6.0;
	return floor(value * resolution) / resolution;
}

vec3 limitColor(vec3 color) {
	float r = limitColor(color.r);
	float g = limitColor(color.g);
	float b = limitColor(color.b);
	return vec3(r, g, b);
}

vec3 increaseBrightness(vec3 color) {
	const float factor = 1.8;
	float r = color.r * factor;
	float g = color.g * factor;
	float b = color.b * factor;
	return vec3(r, g, b);
}

vec4 glitch(vec3 color) {
	if (pixelGlitches[0] == 1) {
		color = vec3(color.r, 1.0, color.b);
	}

	return vec4(color, 1.0);
}

void main() {
	vec2 screenPos = vec2(gl_FragCoord.x, height - gl_FragCoord.y);
	vec2 pixel = vec2(floor(screenPos.x / width * pixelsX), floor(screenPos.y / height * pixelsY));
	vec2 texturePos = vec2((pixel.x + 0.5) / pixelsX, (pixel.y + 0.5) / pixelsY);
	vec2 pixelCentre = texturePos * vec2(width, height);
	vec2 distance = pixelCentre - screenPos;
	float gradient = smoothstep(pixelRadius - pixelFade, pixelRadius, length(distance));
	vec3 color = texture2D(map, texturePos).rgb;

	color = increaseBrightness(color);
	color = limitColor(color);

	gl_FragColor = mix(vec4(color, 1.0), vec4(0.0, 0.0, 0.0, 1.0), gradient);
}
