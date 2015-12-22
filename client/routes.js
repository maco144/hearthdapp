Router.configure({
  layoutTemplate: 'navbartop'
});


Router.route('', function(){
  this.render('main');
  this.layout('mainlayout');
});

Router.route('main', function(){
  this.render('main');
  this.layout('mainlayout');
});

Router.route('/games', function(){
  this.render('games');
  this.layout('mainlayout');
});

Router.route('/profile', function(){
  this.render('profile');
	this.layout('mainlayout');
});

Router.route('/signin', function(){
	this.render('signin');
	this.layout('mainlayout');
});

Router.route('/logout', function() {
//
}, {
    name: 'logout',
    onBeforeAction: function () {
      if (Meteor.userId()) {
        Meteor.logout()
      }
      this.next();
    },
    onAfterAction: function () {
      Router.go('/signin');
    }
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  redirect: '/games'
});