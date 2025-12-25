import type { KakuPlugin } from '../core/types';

function webpCheckFunction(classNameToApply: string = 'no-webp'): void {
	const webpTestImage = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
	const img = new Image();
	const body = document.body;

	img.onload = () => {
		if (img.width > 0 && img.height > 0) {
			// body.classList.add('webp');
		} else {
			body.classList.add(classNameToApply);
		}
	};

	img.onerror = () => {
		body.classList.add(classNameToApply);
	};

	img.src = webpTestImage;
}

export const webpCheck: KakuPlugin = {
	phase: 'init',
	init: () => webpCheckFunction(),
};
