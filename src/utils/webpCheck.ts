export function  webpCheck(classNameToApply: string = 'no-webp'): void {

	const webpTestImage: string = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
	const img = new Image();
	const body = document.body;

	img.onload = (): void => {
		if (img.width > 0 && img.height > 0) {
			// body.classList.add('webp');
		} else {
			body.classList.add(classNameToApply);
		}
	};

	img.onerror = (): void => {
		body.classList.add(classNameToApply);
		console.log(`WebP: Unsupported (load error). Class added: ${classNameToApply}`);
	};

	img.src = webpTestImage;
}