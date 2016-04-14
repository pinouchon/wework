Template.tagsSetup.helpers({
  tags: function () {
    return Tags.find();
  }
});

Template.tagsSetup.events({
  'click .prev, click .next': function() {
    $('#tags').hide().selectize()[0].selectize.destroy();
  }
});

Template.tagsSetup.rendered = function () {
  $('#tags').selectize({
    plugins: ['remove_button'],
    persist: false,
    create: false
  });
};