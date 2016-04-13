//Wizard.useRouter(Router);

Template.preferences.helpers({
  steps: function() {
    return [{
      id: 'school-information',
      title: 'Contact information',
      schema: Schemas.schoolInformation
    }, {
      id: 'tags-information',
      title: 'Payment & confirm',
      schema: Schemas.tagsInformation,
      onSubmit: function(data, wizard) {
        var self = this;
        UserPreferences.insert(_.extend(wizard.mergedData(), data), function(err, id) {
          if (err) {
            self.done();
          } else {
            Router.go('viewUserPreferences', {
              _id: id
            });
          }
        });
      }
    }];
  }
});