
/*=============================================
=            CONSTANTS            =
=============================================*/

const SUBSCRIBED_CLASS = 'subscribe-btn--subscribed';
const SAVED_CLASS = 'saved-btn--saved';


/*=====  End of CONSTANTS  ======*/





/*=============================================
=                    Tabs                    =
=============================================*/

/**
 * Класс для управления вкладками на странице.
 * 
 * Экземпляр класса управляет работой одного переключателя вкладок.
 * Для корректной работы контент для каждой вкладки должен быть помечен классом `tab__content--hide`.
 * Элементы `<input type="radio">` должны содержать атрибуты `data-tab-for` с именем класса блока с контентом.
 */
class TabsHandler
{
	/** @type {HTMLInputElement} */
	#currentTabInput;
	
	CLOSE_TAB_CLASS = 'hidden';

	constructor( tabListSelector )
	{
		/** @type {HTMLElement} */
		const tabsList = document.querySelector( tabListSelector );
		if( !tabsList || !tabsList instanceof HTMLElement )
			return;

		tabsList.addEventListener(
			'change',
			this.changeTabHandler.bind( this ),
		);

		this._showSelectedTab( tabsList );
	}

	/**
	 * @param {Event} event
	 */
	changeTabHandler( event )
	{
		const target = event.target;
		if( !target instanceof HTMLInputElement )
			return;
		
		this._changeTab( target );
	}

	/**
	 * @param {HTMLInputElement} tabInput
	 */
	_changeTab( tabInput )
	{
		if( this.#currentTabInput === tabInput )
			return;

		this._removeTabSelection( this.#currentTabInput );
		this._selectTab( tabInput );
		this.#currentTabInput = tabInput;
	}

	/**
	 * @param {HTMLInputElement} tabInput
	 */
	_removeTabSelection( tabInput )
	{
		if( tabInput.checked || !tabInput.dataset.tabFor )
			return;

		const tabContent = this._getTabContent( tabInput );
		if( !tabContent )
			return;
		
		tabContent.classList.add( this.CLOSE_TAB_CLASS );
	}

	/**
	 * @param {HTMLInputElement} tabInput
	 */
	_selectTab( tabInput )
	{
		if( !tabInput.checked || !tabInput.dataset.tabFor )
			return;

		const tabContent = this._getTabContent( tabInput );
		if( !tabContent ) {
			return;
		}
		
		tabContent.classList.remove( this.CLOSE_TAB_CLASS );
	}

	/**
	 * @param {HTMLInputElement} tabInput
	 */
	_getTabContent( tabInput )
	{
		return document.querySelector( '.' + tabInput.dataset.tabFor );
	}

	/**
	 * @param {HTMLElement} tabList
	 */
	_showSelectedTab( tabList )
	{
		/** @type {NodeListOf<HTMLInputElement>} */
		const tabInputList = tabList.querySelectorAll( 'input[type="radio"]' );

		if( tabInputList.length === 0 )
			return;
		
		for( const input of tabInputList.values() )
			if( input.checked )
			{
				this.#currentTabInput = input;
				this._selectTab( input );
				return;
			}
	}
}



/*=============================================
=                   Header                   =
=============================================*/

/**
 * Повесить слушателя на событие прокрутки экрана, чтобы менять цвет шапки, когда она отрывается от верхнего края страницы
 */
function headerColorizeInit() {
	const header = document.querySelector( '.page-header--scrolled.page-header--text-only' );
	if( !header )
		return;
	
	document.addEventListener(
		'scroll',
		() => {
			if( window.scrollY > 10 )
			{
				if( header.classList.contains( 'page-header--page-part' ) )
					header.classList.remove( 'page-header--page-part' );
			}
			else {
				if( !header.classList.contains( 'page-header--page-part' ) )
					header.classList.add( 'page-header--page-part' );
			}
		}
	);
}

headerColorizeInit();




/*=============================================
=               Document Clicks               =
=============================================*/


function handleDocumentClicks()
{
	document.addEventListener(
		'click',
		( event ) => {
			/** @type {Element} */
			const target = event.target;

			if( target.closest( '.subscribe-btn' ) )
			{
				handleReadButtonClick( target.closest( '.subscribe-btn' ) );
				return;
			}

			if( target.closest( '.saved-btn' ) )
			{
				handleSaveButtonClick( target.closest( '.saved-btn' ) );
				return;
			}
		}
	)
}

handleDocumentClicks();



/*=============================================
=                 Read Button                 =
=============================================*/

/**
 * Обработать клик по кнопке подписки на ресурс (Читать)
 * 
 * @param {HTMLButtonElement} button
 */
function handleReadButtonClick( button )
{
	if( button.classList.contains( SUBSCRIBED_CLASS ) )
	{
		button.classList.remove( SUBSCRIBED_CLASS );
		button.querySelector( 'span' ).textContent = 'Читать'
	}
	else {
		button.classList.add( SUBSCRIBED_CLASS );
		button.querySelector( 'span' ).textContent = 'Читаю';
	}
}


/*=============================================
=               Saving article               =
=============================================*/


/**
 * Обработать клик по кнопке сохранения статьи
 * 
 * @param {HTMLButtonElement} button
 */
function handleSaveButtonClick( button )
{
	if( button.classList.contains( SAVED_CLASS ) )
	{
		button.classList.remove( SAVED_CLASS );
		return;
	}
	
	/** @type {HTMLElement} */
	const modalWindow = document.querySelector( '.modal-window' );
	if( !modalWindow )
	{
		console.warn( 'Can not save article. Modal window is missing.')
		return;
	}
		
	openModalWindow( modalWindow, button );

	
}


/**
 * @param {HTMLElement} window
 */
function clearRadioSelection( window ) {
	window.querySelectorAll('input[type="radio"]')
		.forEach(
			(input) => {
				input.checked = false;
			}
		);
}

/**
 * @param {HTMLElement} modalWindow
 * @param {HTMLButtonElement} saveButton
 */
function openModalWindow( modalWindow, savedArticleButton )
{
	clearRadioSelection( modalWindow );
	modalWindow.dataset.closed = false;
	
	/** @type {HTMLUListElement} */
	const folderList = modalWindow.querySelector( '.folder-selection__folder-list' );
	/** @type {HTMLButtonElement} */
	const saveButton = modalWindow.querySelector( '.main-action-btn' );
	/** @type {HTMLButtonElement} */
	const cancelButton = modalWindow.querySelector( '.additional-action-btn' );
	if( !folderList ||
		!saveButton ||
		!cancelButton
	)
		return;

	
	saveButton.disabled = true;

	const closeModalWindow = () =>
	{
		folderList.removeEventListener(
			'change',
			activateSaveButton,
		);

		saveButton.removeEventListener(
			'click',
			saveArticle,
		);

		cancelButton.removeEventListener(
			'click',
			closeWindow,
		);

		modalWindow.dataset.closed = true;
		clearRadioSelection( modalWindow );
	}

	const activateSaveButton = () => {
		saveButton.disabled = false;
	};

	const saveArticle = ( event ) => {
		event.preventDefault();
		closeModalWindow( modalWindow );
		savedArticleButton.classList.add( SAVED_CLASS );
	};

	const closeWindow = () => {
		closeModalWindow( modalWindow );
	};


	folderList.addEventListener(
		'change',
		activateSaveButton,
		{
			once: true,
		}
	);

	saveButton.addEventListener(
		'click',
		saveArticle,
	);

	cancelButton.addEventListener(
		'click',
		closeWindow,
	);
}



