// Android specific - open links using native browser
function openLink(link) {
	navigator.app.loadUrl(link, { openExternal: true });
}
