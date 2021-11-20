const formValidationResults = {
	email: false,
	password: false,
};



function initLoginButton() {
	const loginButton = document.querySelector( '.login-page__primary-btn' );

	if( !loginButton )
		return;

	listenInputChanges( 'input[type="email"]', loginButton );
	listenInputChanges( 'input[type="password"]', loginButton );

	refreshLoginButton( loginButton );
	listenLoginButtonClick( loginButton );
}

/**
 * @param {string} inputSelector
 * @param {HTMLButtonElement} button
 */
function listenInputChanges( inputSelector, button )
{
	/** @type {HTMLInputElement} */
	const input = document.querySelector( inputSelector );
	if( !input || !input instanceof HTMLInputElement )
		return;

	input.addEventListener(
		'input',
		() => {
			formValidationResults[ input.name ] = input.value !== '';
			refreshLoginButton( button );
		}
	);
}

/** @param {HTMLButtonElement} button */
function refreshLoginButton( button )
{
	button.disabled = !formValidationResults.email || !formValidationResults.password;
}

/** @param {HTMLButtonElement} button */
function listenLoginButtonClick( button )
{
	button.addEventListener(
		'click',
		loginButtonHandler,
	);
}

/**
 * @param {Event} event
 */
function loginButtonHandler( event )
{
	event.preventDefault();
	window.location.href = '../main/index.html';
}




initLoginButton();