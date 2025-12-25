function webpCheckFunction(classNameToApply = "no-webp") {
  const webpTestImage = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
  const img = new Image();
  const body = document.body;
  img.onload = () => {
    if (img.width > 0 && img.height > 0) {
    } else {
      body.classList.add(classNameToApply);
    }
  };
  img.onerror = () => {
    body.classList.add(classNameToApply);
  };
  img.src = webpTestImage;
}
const webpCheck = {
  phase: "init",
  init: () => webpCheckFunction()
};
export {
  webpCheck
};
