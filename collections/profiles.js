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
        avatar: {
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

    Meteor.users.attachSchema(Schema.User);