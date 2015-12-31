Template.CurrentUserMenu.rendered = function() {
    this.$('.ui.dropdown').dropdown();
}

// to close out the Match creation quickform modal 
var matchFormHook = {
	onSuccess: function(insert,result){
		if(result)
			$('#generalModal').modal('hide');
	}
}
AutoForm.addHooks('matchDetails', matchFormHook);