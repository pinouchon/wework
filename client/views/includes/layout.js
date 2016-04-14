Template.layout.helpers({
  containerClass: function() {
    var route = Router.current().route.getName();
    if (route == 'schoolSetup' || route == 'tagsSetup' || route == 'alertSetup' || route == 'searchSetup') {
      return 'container-funnel'
    }
    return 'container';
  }
});