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

Router.route('/register', function(){
	this.render('register');
	this.layout('mainlayout');
});