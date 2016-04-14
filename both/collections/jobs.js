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
    logoUrl: {
      type: String
    },
    percent: {
      type: String
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
  if (true || Jobs.find().count() < 10) {
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
        tags: ['ingénieur', '3d', 'vision', 'développement', 'c++', 'openGL', 'openCV', 'image'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/342223/logo.png?1460621778',
        percent: 98
      },
      {
        //1273185
        title: "Développeur 3D (H/F – STAGE)",
        description: "\
<div>\
\
        \
    <p>Environnement</p>\
        \
    <p>Le Groupe GEXPERTISE, véritable carrefour de la mesure, concentre des expertises dédiées à la topographie, l’aménagement, la construction et l’immobilier, et accompagne ses clients tout au long du cycle de vie du bâtiment. En forte croissance, et comptant plus de 150 collaborateurs, le Groupe est présent en France au travers de 7 agences et se développe à l’international.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Rattaché(e) à la Direction Innovation du Groupe, vous serez intégré(e) au sein d’une équipe qui a notamment pour mission de préparer les nouveaux produits et services autour des technologies du Web et de la 3D&nbsp;: scanner 3D, modélisation 3D, WebGL 3D, casques RV/RA etc.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Nos méthodes de développement sont agiles avec des prises de décisions rapides, un goût pour l’apprentissage des nouvelles technologies et un pouvoir large octroyé à l’équipe.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Mission</p>\
        \
    <p>Vous contribuerez au développement de briques complètes reposant sur les outils et framework suivants&nbsp;: Babylon.js, Unity 3D, Blender Python, etc.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Plusieurs projets cohérents peuvent vous être confiés pour la durée de votre stage, à savoir&nbsp;:</p>\
        \
    <p>Génération automatisée d’itinéraires, basée sur les mesh de navigation<br>\
    Développement, amélioration, et optimisation des shaders WebGL<br>\
    Développement du backoffice de modélisation de bâtiments<br>\
    Tests de matériel&nbsp;: tablette tango, casque RA/RV etc.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>C’est en fonction de vos compétences, de vos envies et de nos priorités que nous définirons le contenu de votre stage.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Profil</p>\
        \
    <p>Vous êtes étudiant(e) en informatique et recherchez un stage d’une durée supérieure à 3 mois. Autonome, dynamique, doté(e) d’un esprit d’équipe, vous êtes passionné(e) de technologies 3D.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Informations complémentaires</p>\
        \
    <p>Basé à Sèvres (92) ou en espaces de coworking sur Paris</p>\
        \
    <p>Rémunération selon profil / expérience</p>\
        \
    <p>Maîtrise de l’anglais souhaitable</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>&nbsp;</p>\
        \
    <p>Postulez</p>\
        \
    <p>Merci d’adresser votre candidature et CV, en citant la référence «&nbsp;DE3D&nbsp;», à l’adresse suivante&nbsp;:</p>\
        \
    <p>recrutement@gexpertise.fr</p>\
        \
    </div>\
        ",
        company: 'Gexpertise',
        location: 'Sèvres (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1273185',
        tags: ['ingénieur', '3d', 'réalité virtuelle', 'web', 'développement', 'openGL', 'interface'],
        logoUrl: "https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/327214/logo.png?1458741341",
        percent: 97
      },
      {
        //1244167
        title: 'Développeur - Réalité Virtuelle',
        description: "\
          Timescope développe les premières&nbsp;<strong>bornes de réalité virtuelle</strong>&nbsp;en libre-service. Les visiteurs d'un lieu peuvent entrer en immersion dans un environnement 3D réaliste qui représente ce même-lieu, mais à une autre époque de l'Histoire.<br>\
    <br>\
    Mission :&nbsp;Consolider le système développé pour les premières bornes, mettre en place un système de monitoring des bornes à distance, prendre en charge un volet de recherche et développement de solutions de Réalité Virtuelle innovantes.<br>\
    <br>\
    Profil recherché :&nbsp;Développeur informatique motivé, curieux, engagé dans son travail, voulant participer au développement d'une start-up dans un secteur en plein essor.</p>\
        ",
        company: 'Timescope',
        location: 'Paris (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1244167',
        tags: ['ingénieur', '3d', 'réalité virtuelle', 'développement', 'c++', 'informatique'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/331359/logo.png?1459417960',
        percent: 95
      },
      {
        //1169874
        title: 'STAGE 3D ET DEVELOPPEUR ROR',
        description: "\
          <div>\
          \
      <p>\
        <span> Campus de Paris</span>\
    </p>\
        \
    <p><strong>Entreprise </strong>:&nbsp;</p>\
        \
    <p>https://www.cutadopters.com/</p>\
    \
  <p>CUT Adopters est une jeune startup qui a pour ambition de devenir le pionnier de la coiffure digitale en proposant des techniques de coupes inédites, conçues et testées pour permettre à tout le monde de couper les cheveux de ses proches.</p>\
        \
    <p>Notre site a été lancé en juin 15 avec 12 vidéos de coupes femmes et enfants. Nous avons fait la preuve du concept en enregistrant du trafic, des ventes, et en ayant des retombées presse dans de grands féminins (Glamour, Marie-Claire, Elle, Cosmopolitan...).</p>\
        \
    <p><strong>Aujourd'hui,</strong> nous souhaitons aller chercher la croissance :</p>\
        \
    <p>- en transformant notre site en&nbsp;market place globale (coiffure, mode, beauté)</p>\
        \
    <p>- en développant les applications</p>\
        \
    <p>- &nbsp;en&nbsp;passant de simples vidéos à une expérience 3D enrichie, interactive et entièrement personnalisée :</p>\
        \
    <p>* Reconnaissance d’image et modélisation 3D des visages et des cheveux<br>\
    Intelligence artificielle permettant un choix judicieux des coupes par l’internaute (conseil en fonction de forme du visage…)<br>\
    * Possibilité de personnaliser une coupe en utilisant son doigt pour raccourcir ou rallonger la coupe, les mèches, etc.<br>\
    * Puis animation 3D pour réaliser pas à pas «&nbsp;sa&nbsp;» coupe, zoomer, tourner, etc.</p>\
        \
    <p>&nbsp;</p>\
        \
    <p><strong>Missions :</strong> notre site est développé en ROR par un prestataire extérieur. Pour accompagner sa dynamique de croissance, nous souhaitons intégrer à temps plein un stagiaire qui puisse prendre en charge le développement des nouvelles fonctionnalités du site (marketplace), lancer les applications et commencer le&nbsp;développement de notre&nbsp;innovation&nbsp;: reconnaissance d’image, animations 3D, intelligence artificielle.&nbsp;</p>\
        \
    <p>Profil recherché : startup spirit, investi à 200%. Intéressé pour devenir associé. &nbsp;</p>\
        \
    </div>        ",
        company: 'CUT ADOPTERS',
        location: 'Paris (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1169874',
        tags: ['ingénieur', '3d', 'image', 'vidéo', 'ux', 'interface', 'ergonomie', 'web'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/313677/logo.png?1457197073',
        percent: 92
      },
      {
        //1065409
        title: 'Dev Software pour Adok',
        description: "\
          <div>\
        \
    <p>Stage Dev @ Adok</p>\
        \
    <p>NOUS:</p>\
        \
    <p>www.my-adok.com<br>\
    Notre solution est un nouveau device, pour de nouveaux usages. Adok est un projecteur tactile autonome et ultraportable, qui transforme n’importe quelle table en surface tactile et connectée.</p>\
        \
    <p>Nous voulons changer la façon dont les gens échangent. Aujourd’hui, en réunion, les outils ne sont pas adaptés au coworking, à la collaboration, au partage. Les écrans sont une barrière à l’attention et à la productivité. Nous remettons le contenu au centre des participants.</p>\
        \
    <p>Avec Adok, travaillons mieux, ensemble.</p>\
        \
    <p>Toi :</p>\
        \
    <p>Tu es en train de devenir&nbsp;un killer du code, tu veux monter en compétences&nbsp;en terme de traitement de flux video, de développement logiciel, tu es autonome et indépendant. Mais surtout, tu crois qu’avec un produit formidable, on peut changer les usages. Tu veux participer à un projet ambitieux, pour révolutionner les échanges entre les gens !</p>\
        \
    <p>Quel que soit ton âge, ta formation et ton expérience, ce que l’on cherche pour Adok, c’est quelqu'un de smart, qui veut apprendre et&nbsp;qui croit en ce projet et qui veut faire partie d’une aventure unique !</p>\
        \
    <p>Compétences :</p>\
        \
    <p>- C, C++, voir éventuellement Python<br>\
    - Développement sous Androïd (OS, bibliothèque graphique SDK, App) - Traitement de flux vidéo (OpenCV)<br>\
    - Tu es autonome et indépendant<br>\
    - Tu sais travailler selon la méthode Agile - Scrum<br>\
    - Tu es très exigeant et tu veux créer le meilleur produit possible !</p>\
        \
    <p>Le JOB:</p>\
        \
    <p>Au sein de notre start-up, tu appuieras notre CTO, spécialisé dans le Hardware (électronique), la programmation embarquée et l’industrialisation de produits, pour créer la meilleure expérience utilisateur de la décennie. Adok fonctionne sous Android, car nous croyons à l’ouverture et en l’open-source.</p>\
        \
    <p>Tu participeras à la création d’un produit qui fascine et donne envie. Dans un futur proche, tu dirigeras une équipe de développeurs pour améliorer sans cesse l’expérience client et les briques logiciels disponibles.<br>\
    En un mot, tu créeras avec nous le nouvel outil de coworking qui fait rêver.</p>\
        \
    <p>Contact : contact@my-adok.com&nbsp;</p>\
        \
    </div>\
        ",
        company: 'Adok',
        location: 'Paris (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1065409',
        tags: ['ingénieur', 'vidéo', 'image', 'C++', 'openCV', 'vision', 'image', 'développement'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/288719/logo.png?1454926480',
        percent: 91
      },
      {
        //990068
        title: 'Application de videomapping en 3D temps-réel',
        description: "\
<div>\
        <p><strong>MOTS VIDEO</strong> ---&gt; millumin.com/jobs</p>\
    <p><br>\
    <strong>REFERENCE</strong> : Stage.FAU7<br>\
    <strong>NIVEAU</strong> : BAC+5 en fin d’études (perspective d’embauche)<br>\
    <strong>SECTEUR</strong> : informatique appliquée aux métiers du spectacle vivant</p>\
\
    <p><strong>L’ENTREPRISE</strong><br>\
    Anomes SARL est un éditeur de logiciel spécialisé dans le spectacle vivant (théâtre, danse, événementiel et musées). Son produit phare, Millumin, est commercialisé dans le monde entier, et compte de prestigieuses références comme la Comédie-Française ou le Théâtre National de Chaillot.<br>\
    Nous collaborons aussi avec des artistes comme la compagnie Adrien M / Claire B (https://www.vimeo.com/amcb/air).</p>\
\
  <p><strong>LE PROJET</strong><br>\
    Il s’agit de recherche et développement, axés sur le création de contenu graphique/vidéo pour le spectacle vivant, et sur lequel les acteurs ou l’audience pourront intéragir.<br>\
    Veuillez nous contacter pour obtenir plus d’informations.</p>\
    <p><strong>METHODOLOGIES &amp; TECHNOLOGIES</strong><br>\
    Use-cases, prototypes papiers, et réunions de conception en équipe.<br>\
    OpenGL/WebGL/OpenCV pour le développement.<br>\
    Fonctionnement par itérations (méthodes agiles), avec planification et estimation régulière des tâches. Point quotidien sur l’avancement du projet. Démo en fin d’itération.</p>\
    <p><strong>VOUS &amp; NOUS</strong><br>\
    Nous cherchons une personne atypique et créative. Ayant une sensibilité artistique. Familière avec la programmation graphique, et les technologies des jeux vidéos. Nous vous formerons aux bonnes pratiques de développement et au travail en équipe. Vous serez confronté à de nouvelles technologies, à des challenges de R&amp;D.<br>\
    Nous vous accueillerons dans des bureaux conviviaux, partagés avec des photographes, designers, graphistes, vidéastes. Et même des plantes.</p>\
    <p>Les candidats avec une mauvaise orthographe sont acceptés. Ils auront la chance de progresser.</p>\
    <p><br>\
    <strong>LIEU</strong> : Paris 2ème arrondissement<br>\
    <strong>DATE &amp; DUREE</strong> : le stage débutera entre février et avril 2016 pour une durée de 6 mois<br>\
    <strong>REMUNERATION</strong> : 1200€ brut par mois, avec perspective d’embauche<br>\
    <strong>CONTACT</strong> : Philippe Chaurand&nbsp; /&nbsp; contact@anomes.com</p>\
    </div>\
        ",
        company: 'Anomes',
        location: 'Paris (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/990068',
        tags: ['ingénieur', '3d', 'vidéo', 'opengl', 'opencv', 'graphique'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/256054/logo.png?1450782459',
        percent: 91
      },
      {
        //1250254
        title: 'Développer Interface Web Junior',
        description: "\
<div>\
    <p>Notre produit Predictive Analytics aident nos clients a prévoir et influencer les résultats de leur entreprise et réagir aux changements avant qu'ils n'aient lieu. Nos objectifs sont de :<br>\
    o Mettre l'analyse prédictive à la portée d'un plus grand nombre d'utilisateurs<br>\
    o Intégrer l'analyse prédictive dans toutes les applications et processus métier<br>\
    o Tirer parti du Big Data et de l'Internet des Objets pour prédire et agir en temps réel.<br>\
    &nbsp;</p>\
        \
    <p><strong>ÉQUIPE</strong><br>\
    Notre équipe « Software Factory » une l’équipe transversale travaillant sur le produit Predictive Analytics. Nous travaillons sur tout ce qui est assurance qualité, intégration continue et gestion de projet (Nous utilisons Scrum et Kanban). Notre objectif est de permettre au reste de l'organisation de se focaliser sur la création du produit. Notre équipe est à la recherche d'un ingénieur talentueux pour mettre en place un projet interne ambitieux. Ce sera une occasion unique pour vous d'en apprendre davantage sur le machine learning, les algorithme prédictif, l'assurance qualité, gestion de projet et le développement d’applications au seins d’un géant du logiciel d’entreprise...<br>\
    &nbsp;</p>\
        \
    <p><strong>MISSIONS ET RESPONSABILITÉS</strong><br>\
    En tant que stagiaire dans notre équipe, vous travaillerez dans un environnement multiculturel et serez expose aux méthodologies Agile et Design Thinking.<br>\
    Dans ce rôle, vos tâches seront :<br>\
    - Analyser et comprendre les besoins des utilisateurs vis a vis du test et du reporting,<br>\
    - Participer aux itérations sur le produit<br>\
    - Implémenter l’interface utilisateur et le code serveur en collaboration avec le reste de l'équipe.<br>\
    - Discuter de la faisabilité et des alternatives de conception avec le reste de l'équipe.<br>\
    - Effectuer des tests d’utilisabilité du produit.<br>\
    - Apprendre de nouvelles techniques et méthodologies de pointe<br>\
    - Vous amuser<br>\
    &nbsp;</p>\
        \
    <p><strong>PROFIL RECHERCHÉ</strong><br>\
    - Expérience en programmation web (HTML5, CSS3 et JavaScript) et backend (Java, perl) est requise.<br>\
    - Connaissance de AngularJS, Angular Material, Java, Git, Linux, Jersey2 sont un plus<br>\
    - Créativité et une bonne interaction avec les utilisateurs<br>\
    - Autonome, indépendant et capacité a apprendre rapidement.<br>\
    - Faire des propositions sur l’amélioration de l’outil et des façons de faire.<br>\
    - Maîtrise de l'anglais obligatoire. (La moitié de nos équipes sont a Dublin)</p>\
        \
    <p><br>\
    Période de Stage &amp; Durée<br>\
    Les dates sont flexibles et seront fixées avec l'Elève en fonction du calendrier de l'école. Une durée de six mois environ serait souhaitable.<br>\
    <br>\
    Merci de bien vouloir postuler sur notre site et ajouter une lettre de motivation.</p>\
        \
    </div>\
        ",
        company: 'SAP France',
        location: 'Paris (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1250254',
        tags: ['ingénieur', 'c++', 'interface', 'web', 'design'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/333310/logo.png?1459626076',
        percent: 76
      },
      {
        //1244522
        title: 'Stage - Développement Python de tests automatiques',
        description: "\
          Timescope développe les premières&nbsp;<strong>bornes de réalité virtuelle</strong>&nbsp;en libre-service. Les visiteurs d'un lieu peuvent entrer en immersion dans un environnement 3D réaliste qui représente ce même-lieu, mais à une autre époque de l'Histoire.<br>\
    <br>\
    Mission :&nbsp;Consolider le système développé pour les premières bornes, mettre en place un système de monitoring des bornes à distance, prendre en charge un volet de recherche et développement de solutions de Réalité Virtuelle innovantes.<br>\
    <br>\
    Profil recherché :&nbsp;Développeur informatique motivé, curieux, engagé dans son travail, voulant participer au développement d'une start-up dans un secteur en plein essor.</p>\
        ",
        company: 'Thales',
        location: 'Châtenay-Malabry (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1244522',
        tags: ['ingénieur', '3d', '3d', 'c++', 'interface'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/1611/logo.png?1406905260',
        percent: 75
      },
      {
        //1154958
        title: 'Assistant Artiste 3D - Stage',
        description: "\
<div>\
        <span>France - Paris - Montreuil</span>  <span><div>Créateur et distributeur de jeux vidéo tels qu’Assassin’s Creed, Just Dance, ou encore Les Lapins Crétins, Ubisoft est aujourd’hui un acteur majeur du secteur du divertissement. Plus de 10 000 collaborateurs répartis dans 28 pays contribuent à la richesse et à la créativité des projets du groupe.<br><font><font>Vous souhaitez participer à notre aventure ? Ubisoft recherche un(e)</font></font><br>&nbsp;<br><strong><span><font>Assistant Artiste 3D - Stage (H/F)</font></span></strong>\
    </div>&nbsp;<br><strong><u><span><font><font>Missions: </font></font></span></u></strong><br>&nbsp;<br><font><span>Vous serez en charge d'accompagner les artistes en charge de la création d’assets graphiques 3D et de contenus liés aux jeux mobiles.&nbsp;</span><span>Sous la responsabilité du Producer, vos principales missions seront :</span></font><ul>\
    <li><font><span>Concevoir des éléments 3D (personnages, props, décors, UI, etc.) ;</span></font></li>\
    <li><font><span>Implémenter les assets graphiques avec les outils de la production</span></font></li>\
    <li><font><span>Proposer des améliorations pour nos prototypes, élargir les possibilités de création de nos programmeurs ;</span></font></li>\
    <li><font><span>Proposer des solutions pour épauler les équipes de production.</span></font></li>\
    </ul>&nbsp;<br><strong><u><span><font>Profil du candidat</font></span></u></strong><ul>\
        <li><font><span>Étudiant de niveau Bac+4/5, vous avez idéalement une expérience dans le jeu vidéo et vous avez participer à une production de jeu 3D</span></font></li>\
    <li><span>Compréhension de la chaîne de création d’un jeu vidéo mobile ;</span></li>\
    <li><span>Excellent niveau en dessin ;</span></li>\
    <li><span>Connaissance des principes de l’animation est un plus ;</span></li>\
    <li><span>Très bon relationnel. Organisation. Autonomie ;</span></li>\
    <li><span>Intérêt pour les nouvelles technologies et façons de jouer.</span></li>\
    </ul>\
    <strong><u><span><font>Avantages</font></span></u></strong><br>&nbsp;<br><font><font>Gratification selon le niveau d’études.</font></font><br><font><font>Tickets Restaurant, Remboursement de 50 % du titre de transport, 2 jeux vidéo gratuits, Réduction billetterie (concerts/spectacles), Accès à la salle de sport Ubisoft à tarifs préférentiels, etc…</font></font><br>&nbsp;<br><div>\
        <span><font><font>Stage de 6 mois - A pourvoir Janvier 2016 – Localisation&nbsp;:</font></font></span> <span><font><font>Montreuil&nbsp;</font></font></span>\
    </div></span>\
    </div>\
        ",
        company: 'Ubisoft',
        location: 'Montreuil (France) ',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1154958',
        tags: ['ingénieur', '3d', 'design', 'image', 'vidéo'],
        logoUrl: 'https://www.jobteaser.com/fr/entreprises/ubisoft',
        percent: 72
      },
      {
        //1133141
        title: 'Ingénieur WebGL',
        description: "\
<div>\
            \
        <h2>Entreprise</h2>\
            \
        <p>EGIDIUM Technologies développe des solutions pour la sécurisation des sites sensibles et des grands événements. Ses logiciels, destinés notamment aux postes de contrôle sûreté - sécurité, offrent un pilotage unifié et une aide à la décision en temps réel. EGIDIUM Technologies a pour ambition de devenir le leader européen du marché du Physical Security Information Management (« PSIM »).&nbsp;Basée en Ile de France, lauréate de nombreux prix nationaux, EGIDIUM Technologies est soutenue par Bpifrance.&nbsp;</p>\
        \
    <h2>Mission</h2>\
        \
    <p>EGIDIUM Technologies examine l'opportunité d'améliorer ses solutions de visualisation 3D et de les porter sur des architectures web. Dans ce contexte, ils&nbsp; recrutent en stage&nbsp;un ingénieur WebGL H/F<br>\
    <br>\
    Au sein de l'équipe produit et R&amp;D,&nbsp; vous réalisez une étude puis le prototypage d’une application en WebGL. Dans un premier temps, vous étudiez les solutions candidates en WebGL et identifiez les verrous techniques possibles pour les logiciels d’Egidium. Vous réalisez ensuite des travaux de prototypage qui répondent aux fonctionnalités critiques repérées. Vous développez, intégrez et testez vos prototypes web dans le logiciel existant.</p>\
        \
    <h2>Profil recherché</h2>\
        \
    <p>De formation bac + 4 ou 5 en informatique, vous êtes passionné(e) par le développement 3D et WebGL.</p>\
        \
    </div>\
        ",
        company: 'EGIDIUM Technologies',
        location: 'Orsay (France)',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1133141',
        tags: ['ingénieur', '3d', 'openGL', 'vidéo', 'web'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/305230/logo.png?1456486210',
        percent: 45
      },
      {
        //936110
        title: 'Reconnaissance de gestes techniques par analyse vidéo 2D / 3D',
        description: "\
<div>\
        <p>Entreprise :CEA LIST</p>\
        \
    <p>Laboratoire de Vision et d’Ingénierie des Contenus</p>\
        \
    <p><br>\
    Mission :<br>\
    Le Laboratoire a en particulier développé des méthodes d’analyse et reconnaissance des actions et gestes humains, dans le cadre de la vie à domicile. Il s’agira dans le cadre de ce stage, de concevoir, développer et évaluer une méthode de reconnaissance, par vision, de gestes techniques plus précis, par exemple ceux d’un opérateur sur une chaîne de production ou les gestes d’un sportif en action.<br>\
    La méthode à réaliser s’inspirera de l’approche dédiée aux actions de la vie courante, ainsi que des approches plus spécifiques présentes dans la littérature scientifique..<br>\
    Capture gestuelle par kinect<br>\
    exemple de geste opérateur<br>\
    exemple de geste sportif<br>\
    Contenu technique du stage :<br>\
    Etude bibliographique sur la reconnaissance de gestes d’opérateurs techniques ou sportifs par traitement vidéo éventuellement complété de capteurs annexes.<br>\
    Prise en main des méthodes de détection des actions de la vie courante du Laboratoire Conception et développement d’une méthode de détection de gestes techniques<br>\
    Evaluation sur des bases de données réalistes et démonstration sur des vidéos acquises dans notre Laboratoire.<br>\
    Profil recherché :</p>\
        \
    <p>Ingénieur, Master 2</p>\
        \
    <p>Compétences : Vision par ordinateur, apprentissage, SVM, traitement d’images, C++</p>\
        \
    <p>&nbsp;</p>\
        \
    </div>\
        ",
        company: 'Commissariat à l\'Energie Atomique et aux Energies Alternatives (CEA)',
        location: 'Gif-sur-Yvette (France) ',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/936110',
        tags: ['ingénieur', '2d', '3d', 'c++', 'image', 'vision'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/assets-3-jobteaser-production/assets/picto_offres_placeholder-b9aab7034d1287684f06695af0a80322.png',
        percent: 39
      },
      {
        //1179764
        title: 'Software Engineer (web/python) - startup - SkillCorner',
        description: "\
<div>\
            \
        <p>Entreprise :<br>\
    SkillCorner est une startup issue des filières Entrepreneurs de Centrale Paris et de l’ESSEC.<br>\
    Nous développons des algorithmes d’intelligence artificielle appliqués aux sports collectifs professionnels. A partir d’une simple vidéo de matchs, nos algorithmes localisent joueurs et ballon, identifient chaque joueur, chaque fait de jeu, chaque schéma tactique. Les données récupérées (20 millions/match) sont valorisées chez nos différents clients : clubs, médias, bookmakers.&nbsp;</p>\
        \
    <p>Mission :<br>\
    Vous serez responsable du développement de l’application web qui permet aux clients d’analyser leurs matchs. Cela comprend le développement du site web (front‐end et back‐end) mais également la mise en place d’une infrastructure capable de traiter les matchs. Vous travaillerez avec de nombreuses technologies dont Python (Django), TypeScript (Angular2), PostgreSQL et AWS.&nbsp;<br>\
    <br>\
    Profil recherché :<br>\
    Passionné de programmation, vous adorez la technique, le code propre et bien organisé.<br>\
    Vous avez déjà de l'expérience dans au moins une des technologies que l'on utilise.<br>\
    Vous êtes curieux, dynamique, polyvalent, et souhaitez participer au&nbsp;développement d’une<br>\
    startup apportant une réelle innovation techologique<br>\
    Si, en plus, vous avez des connaissances en Computer Vision, Machine Learning ou Deep Learning, on est impatient de vous recontrer!<br>\
    Toute connaissance footballistique, rugbystique (ou babyfootballistique) sera appréciée&nbsp;</p>\
        \
    </div>\
        ",
        company: 'SkillCorner',
        location: 'Paris (France) ',
        url: 'https://www.jobteaser.com/fr/offres-emploi-stage/1179764',
        tags: ['ingénieur', 'web', 'vision', 'développement', 'informatique'],
        logoUrl: 'https://storage.gra1.cloud.ovh.net/v1/AUTH_ba5613a94d1942948dd79adf42a2fa02/jobteaser-production/system/asset/logos/316128/logo.png?1457529437',
        percent: 35
      },




//
//      {
//        //xxxxxxxxx
//        title: '',
//        description: "\
//\
//        ",
//        company: '',
//        location: '',
//        url: '',
//        tags: '',
//        logoUrl: ''
//      }
    ];
    Jobs.remove({});
    list.forEach(function(job) {
      Jobs.insert({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        url: job.url,
        tags: job.tags,
        logoUrl: job.logoUrl,
        percent: job.percent,

        contact: 'jobteaser',
        jobtype: "Internship",
        remote: false,
        userId: '123',
        userName: 'auto',
        status: 'active'
      });
    });

  }
}