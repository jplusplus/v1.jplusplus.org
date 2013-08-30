J++ Projet vélo 
===============
L'opacité par la transparence
-----------------------------

Inspiré par un travail de Jean Abbiateci sur les accidents de la route dans le Finistère, j'ai décidé de me pencher sur le fichier des [accidents corporels de la circulation entre 2006 et 2011](http://www.data.gouv.fr/DataSet/564096?xtmc=s%C3%A9ucrit%C3%A9+routi%C3%A8re&xtcr=7). Mis en ligne sur [data.gouv.fr](http://www.data.gouv.fr/) en juillet 2012, ce fichier regroupe six ans d'accidents de la route en France, tout véhicules confondus soit une base de données de 454 372 accidents.

Cycliste au quotidien, j'ai entrepris de ne m'intéresser qu'aux accidents impliquant des cyclistes. Armé de bonne volonté, il ne me restait donc plus qu'à mettre les mains dans le cambouis. Et le moins qu'on puisse duire, c'est qu'il y en a une bonne couche.


###Première phase : découverte des données

Première surprise, les données qui nous intéressent sont sur deux fichiers distincts. L'[un](http://www.data.gouv.fr/var/download/86fca608076ba3c90e66fa358af047a.csv) de 43mo, l'[autre](http://www.data.gouv.fr/var/download/a15c2d0c2bb4064336b49ad4069c55a7.csv) de 23mo. Le premier fichier mentionne les conditions de l'accident (type de collision, conditions atmosphériques, catégorie de route mais aussi départements et communes voir coordonnées GPS pour certains,...). Le deuxième fichier, lui, nous intéresse davantage pour l'instant car il s'attarde sur  les types de véhicules impliqués dans chaque accident. Il fait aussi état du nombre et de la gravité des blessés, des morts ainsi que le nom de la voie sur laquelle a eu lieu l'accident. Chaque fichier possède une colonne commune, le numéro d'accident `numac`, qui nous permet de les relier. 

![image 1](http://www.julienjego.fr/img-velo/image1.png)

N'espérez pas ouvrir ces fichiers sur un tableur lambda, la quantité de données est trop importante, il est obligatoire de passer par ce qui se fait de mieux aujourd'hui pour le traitement de données, [*OpenRefine*](http://openrefine.org/). Une fois les fichiers ouverts, nouvelle surprise : les noms des colonnes et les données qui vont avec sont illisibles. Entre abréviation (`catr` désigne catégorie de route par exemple) et système codifié par des chiffres (dans cette même catégorie, `1` désigne une autoroute, `2` une route nationale, etc...), le petit [document fourni en annexe](http://www.data.gouv.fr/var/download/29caeb46004bb12ebdbc7633a3f81aac.pdf) et qui explicite tous ces termes ne sera pas de trop.

![image 2](http://www.julienjego.fr/img-velo/image2.png)

Dernière surprise, on s'aperçoit vite que chaque organisme (police, gendarmerie,...) chargé du référencement et de la localisation des accidents le fait à sa sauce. Les plus gentils mentionnent directement les coordonnés GPS des accidents, les moins n'indiquent rien ou presque. Il va falloir faire avec.

###Deuxième phase : épluchage et association des tables

- Pour commencer, il faut que l'on se débarasse des accidents qui ne nous intéressent pas. On se sert donc du second fichier et on s'appuie sur la colonne catégorie de véhicule `catv`. Grâce à la fonction `text filter` d'*OpenRefine*, on filtre cette colonne sur le chiffre 1 (correspondant à la catégorie vélos) et me voilà en présence de ma base de données brute, c'est à dire un fichier d'environ 27000 accidents. Quelques manips plus tard et grâce au numéro d'accident `numac`, on y ajoute une nouvelle colonne avec les véhicules impliqués. On sait maintenant quel véhicule est impliqué dans chaque accident de cycliste et on connait le nombre et la gravité des blessés et/ou des morts. On en profite pour supprimer des colonnes inutiles (année de mise en service du véhicule, assurance, etc).

- Maintenant direction le premier fichier, celui dans lequel sont indiquées les conditions de l'accident. On va devoir se débarasser une nouvelle fois des accidents qu'on ne traîte pas. Pour cela on va se servir de ma colonne commune, `numac`, pour associer mes deux tables. *OpenRefine* permet grâce à la fonction `cell.cross` d'[associer deux tables via une colonne commune](http://googlerefine.blogspot.de/2011/08/vlookup-in-google-refine.html). Ceci étant fait, on filtre la colonne catégorie de véhicule `catv`, nouvellement transférée, sur `1` pour ne retrouver que les accidents impliquant un cycliste. Puis on se débarasse de nouveau de toutes les lignes qui ne m'intéressent pas. Et on supprime toutes les colonnes inutiles (indice de gravité de l'accident, organisme "référenceur", profil de la route, etc). Nous voila donc avec notre table qui nous servira maintenant pour la suite du projet

###Troisième phase : mise en forme et nettoyage des données

#### Obtenir le département et la région de l'accident

Notre principal objectif est de géolocaliser l'ensemble de ces accidents. Pour maximiser nos chances, on va s'appuyer sur le système US, qui géolocalise de cette manière : rue, ville, région, pays.

- Comme vous l'avez peut-être remarquer, les noms des communes ne sont pas indiquées en toutes lettres dans la colonne `com`, on retrouve seulement leur code INSEE (et oui le code postal est un format prioritaire de La Poste). Pour ne rien arranger, le numéro de département, `dep` est séparé et pour unifier la métropole avec les DOM-TOM, ils sont codés sous trois caractères (01 devient 010, 28 devient 280,etc). On utilise alors la fonction `facet` sur la colonne qui nous permet de lister chaque "ensemble" de données. La liste des 95 départements (métropolitains) apparaît sur la gauche avec le nombre de fois où le terme revient dans la colonne et on va devoir, à la main, enlever chaque zéro en trop et rajouter ceux manquant. La fonction `facet` permet quand même d'éviter de le faire sur nos 27000 lignes grâce à la fonction `edit` qui apparaît en survol d'un nombre. Enfin, on va créer une nouvelle colonne qui [croisera les valeurs](http://googlerefine.blogspot.fr/2011/07/merge-2-columns-that-have-both-blank.html) département+code commune. Nous voilà avec quelque chose de plus lisible.

- Pour mettre des mots sur ces nombres, on va créer une nouvelle table *OpenRefine* qui contiendra le nom de chaque commune française accompagné de son code INSEE ([ce fichier est disponible sur le site de l'INSEE](http://www.insee.fr/fr/themes/detail.asp?reg_id=99&ref_id=base-cc-table-appartenance-geo-communes)). Puis de la même manière que tout à l'heure, on va venir associer cette table à la notre via les colonnes contenant chacune le code INSEE. *OpenRefine* va repérer les correspondances et nous dévoiler, enfin,le nom des communes pour nos accidents. 

- Il nous reste alors encore à accompagner les communes des régions correspondantes. Pour cela, pas de solutions miracles malheureusement. Il faut tout d'abord créer une nouvelle colonne vierge qui contiendra les noms de chaque région. Puis on reprend notre ancienne colonne département `dep` qui ne nous sert plus à grand chose maintenant et on y applique une `facet`. On se retrouve de nouveau avec les 95 départements métropolitains. On va cette fois-ci sélectionner grâce à `include` chaque département qui forment une région (75,77,78,91,92,93,94 pour l'Ile-de-France par exemple). Une fois que tous les départements concernés sont sélectionnés, la table principale se met à jour pour n'afficher que les lignes correspondantes, il ne reste plus qu'à remplir la colonne par la région souhaitée. A la main cette fois encore. Mais le plus dur reste à venir.Avec les balbutiements et les erreurs liés à l'utilisation d'un nouvel outil (*OpenRefine*) ainsi que la découverte de tout son potentiel, il aura bien fallu deux jours pour en arriver simplement jusqu'ici. 

![image 3](http://www.julienjego.fr/img-velo/image3.png)

#### Uniformiser les noms de rues

- Le problème majeur que l'on va rencontrer maintenant concerne l'uniformisation des noms de rue, autrement dit la colonne `libelle_voie`. Et c'est là que les choses vont devenir vraiment complexes. Une étude rapide de cette colonne montre une nouvelle fois la diversité des référencements. Ainsi une `avenue jean jaurès` peut très bien être noté de différentes manières : `av jean jaurès` ou `ave.jean jaurès` mais encore `jean jaurès (avenue)` ou `jaurès (av) jean`. Le jeu va consister à gommer toutes ces différences pour permettre une géolocalisation précise et beaucoup plus rapide. Un ordinateur comprend `avenue jean jaurès` mais ne comprendra certainement pas `jaurès (av.) jean`. Pour cela, on va exporter l'ensemble des colonnes `libelle_voie` et `numac` (qui nous permettra ensuite de réintégrer notre colonne par correspondance des numéros) en `.csv`. Puis nous allons nous servir d'un nouvel outil, [*Sublime Text*](http://www.sublimetext.com/), un éditeur de texte (principalement utilisé en programmation) qui possède l'avantage de pouvoir manipuler des expressions régulières.

>Les expressions régulières vont nous permettre d'appliquer sur les noms de rues une recherche ultra précise et éliminer tous les éléments génants comme les indications `(pairs)` ou `(impairs)`, des indications imprécises de numérotation comme `(du 35 au 68)` ou des parenthèses égarées. Beaucoup plus efficace qu'un simple rechercher-remplacer, les regex vont nous simplifier la tâche même si cette partie du nettoyage est la plus longue. Ainsi il aura bien fallu quatre à cinq journées pour obtenir un tout cohérent.

- Mis à part les transformations basiques comme transformer les `bd`, `bvd`, `bd.` en `boulevard` et faire de même pour avenue, rue, pont, rond-point, etc. la majeure partie consiste à corriger les erreurs que l'on a déjà mentionné. Les regex nous permettront par exemple de sélectionner tous les termes du type `(du x au x)` gràce à cette expression `\(du \d* au \d*\)`. Cela semble un peu barbare comme ça mais c'est finalement une logique à assimiler. Les `\` sont là pour désigner que l'on cherche le caractère spécial `(` ou `)` et de même pour `d` qui signifie `digit` et pas la lettre d quand elle est précédée par un antislash ([voir ici pour l'ensemble de la syntaxe des regex](http://www.regular-expressions.info/reference.html)) On vous passe les heures à faire de multiples recherches sur nos 27000 accidents, trouver toutes les petites nuances a été un travail de fourmi...

![image 4](http://www.julienjego.fr/img-velo/image4.png)

- Notre colonne nettoyée, on l'insère de nouveau dans notre table initial grâce au numéro d'accident `numac`qui nous sert aux correspondances. Reste un dernier problème, certaines lignes ne possèdent aucune adresse. On va donc s'appuyer sur la colonne `catr` qui nous permettra de déterminer si l'accident s'est produit sur une route nationale ou départementale. On transforme l'ensemble de ces chiffres au format `RN`, `RD`, `VC` puis on y ajoute la colonne voie qui nous donne dans de nombreux cas le numéro de la route concernée. Nos dernières adresses seront donc de la forme `RN867`, `RD65`, etc...

- Il nous reste alors à [associer les deux colonnes](http://googlerefine.blogspot.fr/2011/07/move-data-from-column-to-other.html) qui contiennent soit les noms de rue soit les noms de route en une seule, pour que tout ceci soit plus lisible. La dernière petite manip consiste ensuite à créer notre colonne `adress` qui contiendra nos adresses au format valide. On assemble donc toutes les données rue/route + ville + région + pays. Vient le moment tant attendu de la géolocalisation !

###Quatrième phase : la géolocalisation

- *OpenRefine* permet de faire appel directement à une API de géolocalisation telle que celle de *Google* ou *Nominatim* d'*OpenStreetMap*, qui va nous permettre de lancer des requêtes sur toutes nos adresses. On va ainsi transformer nos adresses en coordonnés GPS, lisible par n'importe quel outil de cartographie. Pour ça on clique sur la colonne concernée puis `edit column` et `add column by fetching URLs` avant d'entrer dans `expression` [une commande de ce type](https://gist.github.com/pdbartsch/5987932) `"http://nominatim.openstreetmap.org/search?format=json&q=" + escape(value, 'url')"` pour l'API d'*OpenStreetMap*. Attention cepedant aux limitations. *Google* n'accepte que 2500 requêtes par jour par exemple et oblige à se servir de *GoogleMaps* ensuite. *Nominatim* souffre encore d'un manque de précision et la limite de requêtes par jour n'est pas clair. 

![image 5](http://www.julienjego.fr/img-velo/image5.png)

- Après de nombreux balbutiements de ce côté-là aussi, on décide de rendre le travail un peu plus court mais aussi d'utiliser [*CartoDB*](cartodb.com/‎). *CartoDB* s'appuie sur l'API de *Nokia* pour la géolocalisation et ne limite pas le nombre de requêtes pour ces utilisateurs, même si elles sont freinées au bout d'un certain temps. On va tout d'abord exclure les adresses qui sont déjà géocodées dans notre table (environ 6000) grâce à une `facet` sur les colonnes `lat` et `long` pour ne choisir que les `blanks`, c'est à dire les lignes sans coordonnées. Puis on applique une nouvelle `facet` sur les adresses restantes. On s'aperçoit alors que l'avenue Daumesnil à Paris apparaît par exemple 48 fois. Alors plutôt que de géocoder 48 fois la même rue, on va seulement sélectionner les adresses uniques grâce à la fonction `choices` précédée du nombre d'adresse unique (ici environ 14000). Grâce à cette fonction on peut exporter ces adresses en `.tsv`. 

![image 6](http://www.julienjego.fr/img-velo/image6.png)

- Direcetion `CartoDB` dans lequel on crée une nouvelle table qui contiendra toutes nos adresses. Une autre colonne est automatiquement créée : `the_geom` qui va nous permettre grâce au petit bouton `geo` de géolocaliser toutes les adresses d'une colonne. Maintenant il ne reste plus à attendre que les 14000 adresses soient géolocalisées. Dans notre cas, seulement une vingtaine de lignes retournent une erreur, ce qui est plutôt honorable. 

![image 7](http://www.julienjego.fr/img-velo/image7.png)

- Une fois que l'opération a été effectué, *CartoDB* ne nous montre pas les coordonnées qu'il a trouvé ; toutefois, dès que l'on exporte l'ensemble en `.csv`, on les retrouve bien. On crée alors un nouvelle table avec les colonnes `adresses`, `longitude` et `latitude` et on vient croiser ces deux dernières colonnes avec notre table principale grâce à la colonne commune `adresses`. Il ne reste plus qu'à croiser ces données avec nos anciennes et le tour est joué !
 





