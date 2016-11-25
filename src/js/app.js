import setPathCookie from './utils/setPathCookie'
import removeMobileHover from './utils/removeMobileHover'
import wireSocialButtons from './utils/wireSocialButtons'

removeMobileHover()
setPathCookie()

// Add class to html if JS is loaded
document.getElementsByTagName('html')[0].className+='js-loaded'

// Wire header social if present
if(document.querySelectorAll('.g-header__share').length > 0) {
	wireSocialButtons({
		facebook: '.g-header__share-button--fb',
		twitter: '.g-header__share-button--tw'
	})
}