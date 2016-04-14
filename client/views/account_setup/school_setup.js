
Template.schoolSetup.helpers({
  schools: function () {
    return Schools.find();
  }
});

Template.schoolSetup.events({
  'click .prev, click .next': function() {
    $('#schools').hide().selectize()[0].selectize.destroy();
    $('#specialities').hide().selectize()[0].selectize.destroy();
  }
});

Template.schoolSetup.rendered = function () {
  $('#schools').selectize({
    //plugins: ['remove_button'],
    allowEmptyOption: true,
    delimiter: ',',
    hideSelected: true,
    closeAfterSelect: true,
    create: false,
    onChange: function (school) {
      console.log(school);
      var $speSelectize = $('#specialities').selectize()[0].selectize;
      if (school) {
        var schoolElem = Schools.findOne({name: school});
        var specialities = schoolElem && schoolElem.specialities;
        if (specialities) {
          $speSelectize.clearOptions();
          $speSelectize.addOption({value: '', text: "Spécialité..."});
          specialities.forEach(function (spe) {
            $speSelectize.addOption({value: spe, text: spe});
          });
          $speSelectize.refreshOptions();
          $speSelectize.enable();
          $speSelectize.close();
        } else {
          console.log('Error: Unknown school' + school)
        }
      } else {
        $speSelectize.disable();
      }
    }
  });

  $('#specialities').selectize({
    allowEmptyOption: true,
    delimiter: ',',
    hideSelected: true,
    create: false,
    closeAfterSelect: true
  })[0].selectize.disable();

};