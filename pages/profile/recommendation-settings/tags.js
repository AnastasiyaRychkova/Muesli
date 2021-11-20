function initTagsList()
{
	const tagsList = document.querySelector( '.editable-tags-list' );
	if( !tagsList )
		return;

	tagsList.addEventListener(
		'click',
		( event ) => {
			/** @type {HTMLElement} */
			const target = event.target;
			console.log( 'X' );
			if( target.closest( '.editable-tag__btn' ) ) // нажата кнопка
			{
				const tag = target.closest( '.tag-item' );
				
				if( tag.classList.contains( 'tag-item--new' ) ) // [+]
					createTag( tag, tagsList );
				else
					deleteTag( tag, tagsList ); // [x]
			}
		}
	);
}

/**
 * @param {HTMLLIElement} tag
 * @param {HTMLUListElement} tagsList
 */
function deleteTag( tag, tagsList )
{
	tagsList.removeChild( tag );
}


/**
 * @param {HTMLLIElement} tag
 * @param {HTMLUListElement} tagsList
 */
function createTag( tag, tagsList )
{
	makeTagEditable( tag, tagsList );
}

/**
 * @param {HTMLLIElement} tag
 * @param {HTMLUListElement} tagsList
 */
function makeTagEditable( tag, tagsList )
{
	/** @type {HTMLElement} */
	const textField = createEditableTextForTag();
	tag.prepend( textField );
	tag.classList.add( 'tag-item--editing' );
	tag.classList.remove( 'tag-item--new' );
	textField.focus();

	textField.addEventListener(
		'blur',
		() => {
			if( textField.textContent === '' )
			{
				deleteTag( tag, tagsList );
				return;
			}
			makeTagStatic( tag );
			tagsList.append( createAddTagButton( tag ) );
		},
		{
			once: true,
		}
	)
}

/**
 * @returns HTMLElement
 */
function createEditableTextForTag()
{
	const span = document.createElement( 'span' );
	span.classList.add( 'text-tag-label' );
	span.contentEditable = true;
	return span;
}

/**
 * @param {HTMLLIElement} tag
 */
function makeTagStatic( tag )
{
	tag.classList.remove( 'tag-item--editing' );
	tag.querySelector( 'span' ).contentEditable = false;
}

/**
 * @param {HTMLElement} prevTag
 * @returns {HTMLElement}
 */
function createAddTagButton( prevTag )
{
	const addButton = prevTag.querySelector( 'button' ).cloneNode( true );

	const tag = document.createElement( 'li' );
	tag.classList.add( 'tag-item', 'tag-item--new' );
	tag.append( addButton );

	return tag;
}




initTagsList();