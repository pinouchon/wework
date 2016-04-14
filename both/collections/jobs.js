Jobs = new Mongo.Collection("jobs");

Jobs.attachSchema(
  new SimpleSchema({
    title: {
      type: String,
      label: "Job Title",
      max: 128
    },
    company: {
      type: String,
      label: "Company",
      max: 128,
      optional: true
    },
    location: {
      type: String,
      label: "Location",
      max: 128,
      optional: true
    },
    url: {
      type: String,
      label: "URL",
      max: 256,
      optional: true,
      regEx: SimpleSchema.RegEx.Url
    },
    contact: {
      type: String,
      label: "Contact Info",
      max: 128
    },
    jobtype: {
      type: String,
      label: "Job Type",
      allowedValues: JOB_TYPES
    },
    remote: {
      type: Boolean,
      label: "This is a remote position."
    },
    userId: {
      type: String,
      label: "User Id",
      //autoValue: function() {
      //  if (this.isInsert) {
      //    return Meteor.userId();
      //  } else if (this.isUpsert) {
      //    return {
      //      $setOnInsert: Meteor.userId()
      //    };
      //  } else {
      //    this.unset();
      //  }
      //},
      denyUpdate: true
    },
    userName: {
      type: String,
      label: "User Name",
      //autoValue: function() {
      //  if (this.isInsert) {
      //    return getUserName(Meteor.user());
      //  } else if (this.isUpsert) {
      //    return {
      //      $setOnInsert: getUserName(Meteor.user())
      //    };
      //  } else {
      //    this.unset();
      //  }
      //}
    },
    description: {
      type: String,
      label: "Job Description",
      max: 20000,
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS
      }
    },
    status: {
      type: String,
      allowedValues: STATUSES,
      //autoValue: function() {
      //  if (this.isInsert) {
      //    return 'pending';
      //  } else if (this.isUpsert) {
      //    return {
      //      $setOnInsert: 'pending'
      //    };
      //  }
      //},
    },
    featuredThrough: {
      type: Date,
      optional: true
    },
    tags: {
      type: [String]
    },
    featuredChargeHistory: {
      type: [String],
      optional: true
    },
    // Automatically set HTML content based on markdown content
    // whenever the markdown content is set.
    htmlDescription: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("description");
        if (Meteor.isServer && htmlContent.isSet) {
          return cleanHtml(htmlContent.value);
        }
      }
    },
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: new Date()
          };
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    },
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    updatedAt: {
      type: Date,
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      denyInsert: true,
      optional: true
    }
  })
);

Jobs.helpers({
  path: function() {
    return 'jobs/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.title);
  },
  featured: function() {
    return this.featuredThrough && moment().isBefore(this.featuredThrough);
  },
  featuredAllowed: function() {
    return this.status === "pending" || this.status === "active";
  }
});

Jobs.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || 
    (!_.contains(fieldNames, 'htmlDescription') 
      && !_.contains(fieldNames, 'status') 
        && !_.contains(fieldNames, 'featuredThrough') 
          && !_.contains(fieldNames, 'featuredChargeHistory') 
          && doc.status === "pending" && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['userId', 'status']
});

//////////////////////////////////// FAKE DATA /////////////////////////////////////////
if (Meteor.isServer) {
  if (true || Jobs.find().count() < 5) {
    var list = [
      {
        //1274248
        title: 'STAGE : Étude et Développement Drone',
        description: "\
        <div>\
        <p><em><strong>Entreprise :</strong></em><br>\
    AUDENSIEL Technologies a été créé pour répondre aux besoins de nos clients en termes d’innovation et de services dans le secteur de l’Industrie. L’alliance de l’expertise technique et fonctionnelle nous permet d’optimiser la productivité des projets de nos clients.<br>\
    <br>\
    <em><strong>Mission :</strong></em></p>\
        \
    <p>Dans le cadre du développement de nos projets R&amp;D internes, nous recherchons un stagiaire pour travailler sur la partie drone et robotique d’un de nos projets. Il s’agit d’un projet innovant qui englobe des problématiques de vol en autonomie d’un drone, vision 3D, cartographie, intelligence artificielle et analyse d’images. Au cours du stage, vous aurez notamment en charge :<br>\
    1. une analyse des besoins en termes de puissance, d’autonomie, de modularité du drone. Il s’agira aussi d’analyser les différents systèmes de vision qui peuvent être embarqués sur un drone ;<br>\
    2. Après cette analyse, une phase de prototypage du drone avec le système de vision sera mise en place en partant des conclusions de l’analyse. Cette phase devra permettre de valider les choix faits et de construire un prototype fonctionnel ;<br>\
    3. La dernière et principale phase du projet consistera à développer les premiers algorithmes de vol du drone et d’analyse d’images. Cette phase de développement sera réalisée avec les chercheurs du pôle R&amp;D. Nous privilégierons les technologies open-sources telles que Dronecode pour la partie drone et OpenCV.<br>\
    <br>\
    Durant ce stage, vous participerez aux choix d’implémentation et aux réflexions sur nos différents projets R&amp;D.<br>\
    <br>\
    Vous serez encadré par un Responsable R&amp;D et un Responsable technique.&nbsp;</p>\
        \
    <p><em><strong>Profil recherché :</strong></em></p>\
        \
    <p>Vous êtes passionné par la robotique et avez l'habitude de travailler en équipe<br>\
    Des compétences en automatique et en systèmes embarqués sont nécessaires<br>\
    Des compétences en C++, Python, OpenCV seront appréciées&nbsp;</p>\
\
    </div>",
        company: 'AUDENSIEL TECHNOLOGIES',
        location: 'Boulogne-Billancourt (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1274248',
        contact: 'jobteaser',
        jobtype: "Internship",
        remote: false,
        tags: ['ingénieur', '3d', 'vision', 'développement', 'c++', 'openGL', 'openCV', 'image'],
        logo_url: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/342223/logo.png?1460621778'
      },
      {
        //1273185
        title: 'Fake2',
        description: 'fake desc',
        company: 'fake comp',
        location: 'fake loc',
        url: 'http://fake.com',
        contact: 'fake contact',
        jobtype: "Internship",
        remote: false,
        tags: ['', '']
      },
      {
        title: 'Fake3',
        description: 'fake desc',
        company: 'fake comp',
        location: 'fake loc',
        url: 'http://fake.com',
        contact: 'fake contact',
        jobtype: "Internship",
        remote: false,
        tags: ['', '']
      }
    ];
    Jobs.remove({});
    list.forEach(function(job) {
      Jobs.insert({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        url: job.url,
        contact: job.contact,
        jobtype: job.jobtype,
        remote: job.remote,
        tags: job.tags,

        userId: '123',
        userName: 'auto',
        status: 'active'
      });
    });

  }
}