Schema = {};

    Schema.UserProfile = new SimpleSchema({
        firstName: {
            type: String,
            regEx: /^[a-zA-Z-]{2,25}$/,
            optional: true
        },
        lastName: {
            type: String,
            regEx: /^[a-zA-Z]{2,25}$/,
            optional: true
        },
        walletWithdraw: {
            type: String,
            optional: true
        }
    });

    Schema.User = new SimpleSchema({
        _id: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        emails: {
            type: [Object]
        },
        "emails.$":{
            type: Object
        },
        "emails.$.address": {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        'emails.$.verified':{
            type: Boolean
        },
        createdAt: {
            type: Date
        },
        profile: {
            type: Schema.UserProfile,
            optional: true
        },
        services: {
            type: Object,
            optional: true,
            blackbox: true
        }
    });

    Schema.GameRequests = new SimpleSchema({
        player: {
            type: String
        },
        challenger: {
            type: String
        },
        wager: {
            type: Number
        }
    });

    Schema.Players = new SimpleSchema({
        name: {
            type: String,
            optional: true
        },
        stake: {
            type: Number,
            autoform: {
                afFieldInput:{
                    type: Number
                }
            }
        }
    });

    Schema.MatchChallenger = new SimpleSchema({

    });

    Schema.Match = new SimpleSchema({
        host: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            autoform: {
                type: "hidden",
                label: false
            },
            autoValue:function(){ return this.userId }
        },
        game:{
            type: String,
            optional: false,
            autoform: {
                type: "select-radio-inline",
                options: function(){
                    return [
                    {label: "Newerth", value: "newerth"},
                    {label: "Warsow", value: "warsow"}
                    ];
                }
            }
        },
        stake: {
            type: Number,
            optional: false,
            defaultValue: 1,
            min: 1,
            autoform: {
                afFieldInput:{
                    type: Number
                }
            }
        },
        winCondition: {
            type: String,
            optional: false,
            autoform: {
                type: "select",
                defaultValue: "default",
                options: function(){
                    return [
                    {label: "Default", value: "default"},
                    {label: "Kills", value: "kills"},
                    {label: "Time", value: "time"}
                    ];
                }
            }
        },
        numberRounds: {
            type: Number,
            optional: false,
            min: 1,
            defaultValue: 1
        }
    });

    SimpleSchema.debug = true;
    Meteor.users.attachSchema(Schema.User);
    Match.attachSchema(Schema.Match);
