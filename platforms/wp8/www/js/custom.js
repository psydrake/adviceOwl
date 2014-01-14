// Use in-app browser
function openLink(link) {
	if (link && link.match(/^mailto:/)) {
		window.open(encodeURI(link)); 
	}
	else {
		window.open(encodeURI(link), '_blank', 'location=yes'); 
	}
}

function doCustomActions() {
    // google analytics handled by SDK and EasyTracker
	// admob handled in MainPage.xaml and MainPage.xaml.cs
}
