UserPreferences = new Meteor.Collection('userPreferences', {connection: null});
Schemas = {};
Schemas.schoolInformation = new SimpleSchema({
  name:{
    type: String,
    label: "Nom de l'école"
  },
  formation: {
    type: String,
    label: 'Type de formation'
  }
});
Schemas.tagsInformation = new SimpleSchema({
  tags:{
    type: [String],
    label: 'Should be array'
  },
});

//Schemas.contactInformation = new SimpleSchema({
//  name:{
//    type: String,
//    label: 'Name'
//  },
//  address: {
//    type: String,
//    label: 'Address'
//  },
//  zipcode: {
//    type: String,
//    label: 'Zipcode'
//  },
//  city: {
//    type: String,
//    label: 'City'
//  }
//});
//
//Schemas.paymentInformation = new SimpleSchema({
//  paymentMethod: {
//    type: String,
//    label: 'Payment method',
//    allowedValues: ['credit-card', 'bank-transfer'],
//    autoform: {
//      options: [{
//        label: 'Credit card',
//        value: 'credit-card'
//      }, {
//        label: 'Bank transfer',
//        value: 'bank-transfer'
//      }]
//    }
//  },
//  acceptTerms: {
//    type: Boolean,
//    label: 'I accept the terms and conditions.',
//    autoform: {
//      label: false
//    },
//    autoValue: function() {
//      if (this.isSet && this.value !== true) {
//        this.unset();
//      }
//    }
//  }
//});

UserPreferences.attachSchema([
  Schemas.schoolInformation,
  Schemas.tagsInformation
]);
