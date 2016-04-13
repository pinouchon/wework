
Meteor.startup(function() {
	//App.accessRule('https://meteor.local');
       
	console.log('Configuring content-security-policy:');
	//BrowserPolicy.content.allowSameOriginForAll();
	//BrowserPolicy.content.allowOriginForAll('http://meteor.local');
    });

if (Meteor.settings && Meteor.settings.stripe && Meteor.settings.stripe.secretKey) {
    Stripe = StripeSync(Meteor.settings.stripe.secretKey);
}else{
	console.log('ERROR - Stripe API Key Not Found');
}