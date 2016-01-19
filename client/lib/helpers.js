Template.CurrentUserMenu.rendered = function() {
    this.$('.ui.dropdown').dropdown();
}

Template.activeMatch.rendered = function() {
	$('.ui.avatar.image').popup({
		hoverable: true
	});
}