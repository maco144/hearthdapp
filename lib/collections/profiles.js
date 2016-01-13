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

    Schema.MatchPlayer = new SimpleSchema({
        name: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            autoform: {
                type: "hidden",
                label: false
            },
            autoValue:function(){ return this.userId }
        },
        team: {
            type: String,
            optional: true,
            autoform: {
                type: "select",
                defaultValue: "Select",
                options: function(){
                    return [
                    {label: "Select", value: "Select"},
                    {label: "1", value: "1"},
                    {label: "2", value: "2"}
                    ];
                }
            }
        }
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
        },
        players: {
            type: Number,
            optional: false,
            min: 1,
            defaultValue: 1,
            autoform: {
                label: false,
                type: "hidden"
            }
        },
        player: {
            type: [Schema.MatchPlayer],
            optional: true,
            autoform: {
                type: "hidden",
                label: false
            },
            blackbox: true
        }
    });

    SimpleSchema.debug = true;
    Meteor.users.attachSchema(Schema.User);
    Match.attachSchema(Schema.Match);
    Newerth.attachSchema(Schema.Match);
    Warsow.attachSchema(Schema.Match);

