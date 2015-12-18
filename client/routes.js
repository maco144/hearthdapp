Router.configure({
  layoutTemplate: 'navbartop'
});


Router.route('', function(){
  this.render('main');
  this.layout('navbartop');
});

Router.route('main', function(){
  this.render('main');
  this.layout('navbartop');
});

Router.route('/games', function(){
  this.render('games');
  this.layout('navbartop');
});

Router.route('/profile', function(){
  this.render('profile');
  this.layout('navbartop');
});