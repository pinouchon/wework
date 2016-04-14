Schools = new Mongo.Collection("schools");

if (Meteor.isServer) {
  if (Schools.find().count() == 0) {
    Schools.insert({
      name: 'Epitech',
      specialities: ['web', 'sécurité', 'intelligence artificielle', 'embarqué']
    });
    Schools.insert({
      name: 'Epita',
      specialities: ['spé 1', 'spé 2', 'spé 3',]
    });
    Schools.insert({
      name: 'Essec',
      specialities: ['audit', 'droit ', 'entreprenariat', 'conseil']
    });
    Schools.insert({
      name: 'Edhec',
      specialities: ['formation 1', 'formation 2', 'formation 3',]
    });
  }
}