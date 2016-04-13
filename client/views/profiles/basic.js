

Template.basic.helpers({
  steps: function() {
    return [{
      id: 'contact-information',
      title: 'Contact information',
      schema: Schemas.contactInformation
    }, {
      id: 'payment-information',
      title: 'Payment & confirm',
      schema: Schemas.paymentInformation,
      onSubmit: function(data, wizard) {
        var self = this;
        Orders.insert(_.extend(wizard.mergedData(), data), function(err, id) {
          if (err) {
            self.done();
          } else {
            Router.go('viewOrder', {
              _id: id
            });
          }
        });
      }
    }];
  }
});