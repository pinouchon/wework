Tags = new Mongo.Collection("tags");

if (Meteor.isServer) {
  if (Tags.find().count() == 0) {
    Tags.insert({
      name: 'entreprenariat'
    });
    Tags.insert({
      name: 'audit'
    });
    Tags.insert({
      name: 'securite'
    });
    Tags.insert({
      name: 'startup'
    });
    Tags.insert({
      name: 'java'
    });
    Tags.insert({
      name: 'ruby'
    });
    Tags.insert({
      name: 'HTML/CSS'
    });
    Tags.insert({
      name: 'javascript'
    });
  }
}