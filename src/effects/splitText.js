import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

export default function splitText() {

	const targets = document.querySelectorAll('.js-split-text');

	if ( !targets )  return;

	targets.forEach( target => {

		// 1. SplitTextで文字を分割し、各文字にクラスを付与
		const splitTextInstance = new SplitText(target, {
			type: 'chars',
			tag: 'span',
			charsClass: 'char-item'
		});

		// 2. 各文字に対する遅延の基準値を取得
		const delayBase = parseFloat(target.dataset.delayBase) || 0;

		// 3. 分割された各文字要素にループでtransitionDelayを設定
		splitTextInstance.chars.forEach((charElement, index) => {
			// 順番に遅延を適用
			const delay = delayBase * index;
			charElement.style.transitionDelay = `${delay}s`;
		});

	});

}