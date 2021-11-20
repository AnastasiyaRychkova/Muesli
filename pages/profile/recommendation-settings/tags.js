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
			if( target.closest( '.editable-tag__btn' ) )
			{
				const tag = target.closest( '.tag-item' );
				
				if( tag.classList.contains( 'tag-item--new' ) )
					createTag( tag );
				else
					deleteTag( tag, tagsList );
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
	const textField = createTagEditableText();
	tag.prepend( textField );
	tag.classList.add( 'tag-item--editing' );
	textField.focus();

	textField.addEventListener(
		'blur',
		() => {
			if( textField.textContent === '' )
			{
				deleteTag( tag );
				return;
			}
			makeTagStatic( tag );
			tagsList.
		},
		{
			once: true,
		}
	)
}

/**
 * @returns HTMLElement
 */
function createTagEditableText()
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


initTagsList();