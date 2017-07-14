precision mediump float;

uniform float width;
uniform float height;
uniform sampler2D map;

uniform float pixelsX;
uniform float pixelsY;
uniform float pixelRadius;
uniform float pixelFade;
uniform sampler2D glitches;

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

vec3 glitchColor(vec3 color, int glitch) {
	if (glitch == 255) {
		color = vec3(0.0, 0.0, 0.0); // stuck off
	}
	else if (glitch == 254) {
		color = vec3(1.0, 1.0, 1.0); // stuck on
	}
	else if (glitch == 1) {
		color = color * 0.5; // dim
	}
	else if (glitch == 2) {
		color = vec3(0.0, color.g, color.b); // red failed
	}
	else if (glitch == 3) {
		color = vec3(color.r, 0.0, color.b); // green failed
	}
	else if (glitch == 4) {
		color = vec3(color.r, color.g, 0.0); // blue failed
	}

	return color;
}

vec2 glitchPos(vec2 screenPos, int glitch) {
	if (glitch == 5) {
		screenPos = vec2(screenPos.x - 1.0, screenPos.y);
	}
	if (glitch == 6) {
		screenPos = vec2(screenPos.x + 1.0, screenPos.y);
	}
	if (glitch == 7) {
		screenPos = vec2(screenPos.x, screenPos.y - 1.0);
	}
	if (glitch == 8) {
		screenPos = vec2(screenPos.x, screenPos.y + 1.0);
	}

	return screenPos;
}

void main() {
	vec2 screenPos = vec2(gl_FragCoord.x, height - gl_FragCoord.y);
	vec2 pixel = vec2(floor(screenPos.x / width * pixelsX), floor(screenPos.y / height * pixelsY));
	vec2 texturePos = vec2((pixel.x + 0.5) / pixelsX, (pixel.y + 0.5) / pixelsY);

	int glitch = int(texture2D(glitches, texturePos).a * 255.0 + 0.5);
	screenPos = glitchPos(screenPos, glitch);

	vec2 pixelCentre = texturePos * vec2(width, height);
	vec2 distance = pixelCentre - screenPos;
	float gradient = smoothstep(pixelRadius - pixelFade, pixelRadius, length(distance));
	vec3 color = texture2D(map, texturePos).rgb;

	color = increaseBrightness(color);
	color = limitColor(color);
	color = glitchColor(color, glitch);

	gl_FragColor = mix(vec4(color, 1.0), vec4(0.0, 0.0, 0.0, 1.0), gradient);
}
