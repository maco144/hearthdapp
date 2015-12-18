if (Meteor.isClient) {

  Template.navbartop.events({
    'click navbar-nav li': function(event){
      event.preventDefault();
      console.log("event");
    }
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
