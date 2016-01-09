//OLD CODE NOT USING ANYMORE

  // Template.gameRequests.helpers({
  //   'gameRequests': function() {
  //     return GameRequest.find({});
  //   }
  // });


//for testing. currently file upload to a collection
  // Template.main.events({
  // 'submit': function(event, template){
  //   event.preventDefault();
  //   if (window.File && window.FileReader && window.FileList && window.Blob) {
  //     _.each(template.find('#files').files, function(file) {
  //       if(file.size > 1){
  //         var reader = new FileReader();
  //         reader.onload = function(event) {
  //           Collect.insert({
  //             name: file.name,
  //             type: file.type,
  //             dataUrl: reader.result
  //           });
  //         }
  //         reader.readAsDataURL(file);
  //       }
  //     });
  //   }
  //   }
  //   });

        // challenge opponent by selecting them
      // 'click .player': function(){
      //   var playerChallenged = this.name;
      //   var playerChallenger = Meteor.userId();
      //   var wager = this.stake;
      //   if(playerChallenger != playerChallenged){
      //    Meteor.call('requestGame', playerChallenger, playerChallenged, wager);
      //   } 
      //   }

        Template.games.helpers({
    // 'host': function() {
    //   return Match.findOne({host: Meteor.userId()});
    // }
  });

      // 'insertToQ': function( wager){
    //   var currentUserId = this.userId;
    //   Players.update({ name: currentUserId }, { $setOnInsert: { name: currentUserId, stake: wager } }, { upsert: true } ); 
    // },

      Meteor.publish('gameRequests', function() {
    return GameRequest.find({});
    // return GameRequest.find({$or: [
     //   { playerChallenger: Meteor.userId() }, 
     //   { playerChallenged: Meteor.userId() }
     // ]});
  });

    // Meteor.publish('players', function(){
  //     return Players.find({}, {sort: {stake: -1, name: 1}});
  // });



  <!-- <template name="gameRequests">
  <h2>Game Requests</h2>
  <ul>
  {{#each gameRequests}}
    <li>{{player}} vs {{challenged}} for {{wager}} at {{time}}</li>
  {{/each}}
  </ul>
</template> -->

<!-- <template name="joinMatchModal">
    <div class="three-column-grid">
        <div class="column">
            <div class="ui list">
                <div class="item">
                    <i class="map marker icon"></i>
                    <div class="header">Header</div>
                    <div class="description">Description</div>
                </div>
            </div>
        </div>
    </div>
</template> -->

<!--
<form>
    <input id="files" type="file">
    <input type="submit" value="submit">
</form>
    <a href="{{dataUrl}}" target="_blank">{{name}}</a>
    <h2>HOST</h2> 
    {{> hostMatch}}
-->

