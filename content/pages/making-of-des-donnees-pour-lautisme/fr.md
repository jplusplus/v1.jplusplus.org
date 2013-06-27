![](https://twimg0-a.akamaihd.net/profile_images/3278954303/a40ef7da6d16a1c4a33f65b2b59f9f59.jpeg)

[**_Damien Brunon_**](https://twitter.com/silveroux)_, journaliste en formation à l'ESJ, a passé un mois chez Journalism++ à Berlin et à Paris. Il a mis sur pied une opération de crowdsourcing. Le but: obtenir plus de données et de transparence concernant l'autisme en France. Il explique sa démarche.
_



[“Des données pour l’autisme”](https://desdonneespourlautisme.herokuapp.com/) répondra à terme à une multitude de questions concernant la prise en charge de l’autisme, un handicap dont plusieurs centaines de milliers de personnes sont atteintes en France. Cette plate-forme de crowdsourcing et de mise en forme de la base de donnée sont l’aboutissement d’une réflexion journalistique que je vais expliciter ici.


## 1. Pas de données, pas de chocolat




Le datajournaliste travaille avec des données, le problème: en matière d’autisme, il n’existe pas vraiment de données fiables en France. Les raisons sont diverses mais particulièrement liées à la culture médicale de l’autisme dans notre pays. Pendant très longtemps, et malgré sa reconnaissance comme handicap en 1996, on a psychiatrisé l’autisme. Plus clairement, on ne pensait pas que c’était un problème neurologique (ou en tout cas pas uniquement) mais un problème psychiatrique. Beaucoup d’autistes n’ont donc jamais été dépistés comme tels. Encore aujourd’hui, l’accès au dépistage et au diagnostic peut être parfois un chemin de croix pour les familles.




[![](http://jquest.s3.amazonaws.com/jplusplus/files/Screen-Shot-2013-03-05-at-11.17.57-AM.png)](http://jquest.s3.amazonaws.com/jplusplus/files/Screen-Shot-2013-03-05-at-11.17.57-AM.png)





## 2. Le Fichier National des Établissements Sanitaires et Sociaux




Le problème commence à fondre lorsqu’au détour d’une recherche sur une structure qui accueille des autistes, un onglet propose de consulter sa fiche FINESS. Je découvre alors le [Fichier National des Établissements Sanitaires et Sociaux](http://finess.sante.gouv.fr/): une base de donnée avec les caractéristiques de toutes les structures sanitaires et sociales reconnues de France. Après avoir téléchargé le PDF de la nomenclature, j’ai trié les structures par code, choisissant uniquement les codes qui correspondaient aux institutions qui accueillant des handicapés mineurs.


J’ai fait le choix de ne traiter que les mineurs pour une raison simple. Je l’expliquais un peu plus haut, on travaille sur l’autisme depuis trop peu de temps pour avoir une idée de la population autiste majeure. Le problème est d’une telle ampleur qu’il y a deux fois moins de structures qui accueillent des autistes majeurs que des autistes mineurs. Pourtant, pas besoin d’être mathématicien pour comprendre qu’il y a surement beaucoup plus d’autistes majeurs que mineurs.


## 3. Le traitement de la base de données




Me voila donc avec toutes les structures sanitaires et sociales qui accueillent des handicapés mineurs en France, un tableau avec environ 5500 lignes et une trentaine de colonnes. Pour traiter ces données, j’ai utilisé un outil très puissant pour ce genre de travail: [Google Refine](http://code.google.com/p/google-refine/). Grâce aux options de facette par texte et de filtre par colonne, j’ai isolé les structures qui accueillent des autistes. Par concaténation et division de colonnes je suis arrivé à obtenir simplement les informations qui m’intéressent pour chaque structures (nom, adresse, date d’ouverture, nombre de places pour les autistes mineurs). Avec [l’API Yahoo de geolocalisation](http://developer.yahoo.com/boss/geo/), le flag JSON sur l’API et la commande parseJson, j’ai utilisé les adresses pour trouver les coordonnées géographiques de chaque structures. Au terme du traitement, mon tableau ne comprenait plus que 540 lignes et une petite dizaine de colonnes.





## 4. La mise en forme avec CartoDB




L’outil de création de cartes interactives [CartoDB](http://cartodb.com/) est très bien fait et assez esthétique. Il suffit d’uploader un tableur, CartoDB se charge de repérer des données de géolocalisation et génère automatiquement une carte interactive. On peut facilement changer les options de style des cartes ou des points (ou zones) qui nous concernent. On peut aller un peu plus loin dans la mise en forme en modifiant les instructions CartoCSS directement sur le site.




L’idée de mettre sur carte toutes ces structures est arrivé assez logiquement. Si le but était d’estimer si l’offre des structures sanitaires et sociales correspondait à la demande, la première étape était de voir comment étaient répartis géographiquement ces structures. Ici pas de grosse surprise, les noyaux de structures correspondent assez bien aux région peuplés (Région parisienne, Nord-Pas-de-Calais, Alsace-Lorraine, Vallée du Rhône, Côte d’Azur). Il fallait donc aller plus loin.





## 5. Crowdsourcer pour enrichir les données




Nous voilà devant cette longue liste de structures sur une carte, avec des informations pratiques tirées du FINESS. Pour aller plus loin, une seule solution, lancer une opération de crowdsourcing. L’objectif étant de répondre à la question que l’on se pose devant cette carte: est-ce que ça suffit? Pour le savoir, j’ai créé un questionnaire Google Form à deux questions: l’une sur le centre concerné, l’autre sur le temps d’attente pour obtenir une place. Pour bien angler les réponses qui pouvaient être faites au questionnaire, j’ai appelé directement une vingtaine de structures. Seules une petite dizaine m’ont donné des réponses que j’ai pu utiliser, une raison de plus pour demander leur avis aux familles qui attendent.




Un crowdsourcing est complètement tributaire du nombre de personnes qui y répond, il fallait donc absolument trouver des relais médiatiques et associatifs. Côté média, [Eric Mettout](https://twitter.com/Mettout), le directeur adjoint de la rédaction de [l’Express](http://www.lexpress.fr/) a tout de suite été partant. Du côté des associatifs, la démarche a été plus compliquée, certains étant franchement convaincus, d’autres plutôt réticents à une démarche qu’ils ne maîtrisaient ou ne contrôlaient pas.





## 6. L’idée “Des données pour l’autisme”




Une base de donnée créée, une opération de crowdsourcing sur les rails, une ambition à long terme, le développement d’un site internet pour centraliser ce travail coulait de source. “Des données pour l’autisme” devait présenter la démarche, proposer le questionnaire et montrer la carte interactive. Il devait naturellement être bâti selon les règles du responsive design afin d’être consultable sur un écran classique mais aussi sur un smartphone, une tablette ou dans les colonnes de l’Express.fr. J’ai donc dessiné les wireframes sur Mockflow pour qu’il puissent être repris par Pierre Romera, le CTO de Journalism++. Une recherche en creative commons de photos d’autistes sur Flickr lui a permis d’utiliser les beaux clichés de Alain Elorza.





## 7. L’avenir




L’application est désormais lancée, la prochaine étape viendra avec les réponses. Le choix a été fait de ne pas connecter les deux bases de données qui reçoivent les réponses des questionnaires et qui alimentent la carte interactive. Il faudra donc l’entretenir régulièrement pour que la mise en forme soit à jour. Du succès de ce projet dépends sa pérennité et son développement, donc si vous avez lu ce billet jusqu’au bout, parlez en autour de vous et sur les réseaux sociaux!
