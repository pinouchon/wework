Template.header.events({
  'click .navbar-nav a': function(event, template) {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    var _this = $(event.currentTarget);

    if (window.innerWidth < 768) {
      if( !_this.hasClass('box-user-option') ){
         targetButton.click()
      }
    }
  }
});

Template.header.helpers({
  showHeaderFooter: function() {
    var route = Router.current().route.getName();
    var isHome = route == 'home';
    var isFunnel = route == 'schoolSetup' || route == 'tagsSetup' || route == 'alertSetup' || route == 'searchSetup';
    return !isHome && !isFunnel;
  }
});
Template.footer.helpers({
  showHeaderFooter: function() {
    var route = Router.current().route.getName();
    var isHome = route == 'home';
    var isFunnel = route == 'schoolSetup' || route == 'tagsSetup' || route == 'alertSetup' || route == 'searchSetup';
    return !isHome && !isFunnel;
  }
});

Template.headerUserMenu.helpers({
  profile: function() {
    return Profiles.findOne({
      userId: Meteor.userId()
    });
  }
});

Template.headerUserMenu.events({
  'click #signOut': function(event, template) {
    Meteor.logout();
    Router.go("/");
  },
  'click .navbar-nav a': function(event, template) {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    var _this = $(event.currentTarget);

    if (window.innerWidth < 768) {
      if( !_this.hasClass('box-user-option') ){
         targetButton.click()
      }
    }
  },
  'click #userProfile': function(event, template) {
    event.preventDefault();
    Modal.show('userProfile');
  }
});

Template.headerUserMenu.onRendered(function(){
  this.$('.dropdown-toggle').dropdown()
});
