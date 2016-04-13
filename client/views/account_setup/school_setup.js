Template.schoolSetup.helpers({
  schools: function() {
    return Schools.find().fetch().map(function(it){ return it.name; });
  },

  specialities: function() {

  }
});

Template.schoolSetup.events({
  'change #schools': function (e) {
    alert('changed');
    //Meteor.call('click', $("#box").val());

  }
})

Template.schoolSetup.rendered = function() {
  Meteor.typeahead.inject();
};