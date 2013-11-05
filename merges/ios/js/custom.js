// iOS specific (in-app browser)
function openLink(link) {
	if (link && link.match(/^mailto:/)) {
		window.open(encodeURI(link)); 
	}
	else {
		window.open(encodeURI(link), '_blank', 'location=yes'); 
	}
}
