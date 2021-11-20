

function initHighlighting() {
	const highlighting = document.querySelector( '.highlighting' );
	const highlightingTool = document.querySelector( '.highlight-popup__colors' );
	if( !highlighting || !highlightingTool )
		return;

	highlightingTool.addEventListener(
		'change',
		( event ) => {
			/** @type {HTMLInputElement} */
			const target = event.target;
			if( !target instanceof HTMLInputElement )
				return;

			const colorNumber = target.className.match( /highlight-color--(.)/ )[1];

			highlighting.className = 'highlighting highlighting--'+colorNumber;
		}
	)

	initHighlightingCloseButton();
}

/**
 * @param {HTMLElement} highlightingTool
 */
function initHighlightingCloseButton() {
	const highlightingPopup = document.querySelector( '.highlight-popup' );
	const closeButton = highlightingPopup.querySelector( '.highlight-popup__close-btn' );
	if( !highlightingPopup || !closeButton )
		return;

	closeButton.addEventListener(
		'click',
		() => {
			highlightingPopup.classList.add( 'hidden' );
		}
	)
}

initHighlighting();