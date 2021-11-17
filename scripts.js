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
	
	CLOSE_TAB_CLASS = 'tab__content--hide';

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