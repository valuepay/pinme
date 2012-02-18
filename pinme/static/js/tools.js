function message(text){
	$('div#message').hide().text(text).slideDown('slow');
	setTimeout("$('div#message').slideUp('slow')", 5000);
}