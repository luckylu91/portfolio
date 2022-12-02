import { Box } from "@mui/system";
import { Project } from "./Project";
import { Section } from "./Section";

export function Sections() {
  return (
    <Box>
      <Section title="Profil">
          <p>
            Depuis que je suis petit, je suis passionné de science et de logique.
            <br/>
            J'ai débuté l'informatique au lycée grâce à lesiteduzero.com
            (nouvellement openclassroom). L'informatique est resté un hobby
            pendant mes années de prépa.
            <br/>
            Voulant concilier les math et l'informatique, j'ai d'abord
            choisi le Machine Learning.
            Cepandant j'ai une soif de résoudre des problèmes plus généraux,
            mais j'ai rapidement admis que c'était le "pur développement"
            qui était fait pour moi.
            <br/>
            Aujourd'hui je cherche des projets qui me challenge de la conception
            à la réalisation, et j'aimerais les faire dans une équipe dynamique
            et qui a la même passion que moi.
          </p>
        </Section>
        <Section title="À propos de moi">
          <p>
            Mon type d'humour c'est l'absurde, et de peinture le surréalisme.
            J'adore le cinéma.
            Il m'arrive également d'essayer d'exprimer ma créativité "artistique".
          </p>
        </Section>
        <Section title="Jeux vidéo">
          <p>
            Depuis petit je suis baigné dans l'univers des jeux vidéo:
            les consoles portables, les discussions à l'école,
            les soirées entre amis. Aujourd'hui les occasions et les impulsions de
            jouer se raréfient de plus en plus.
            <br/>
            Mais je suis toujours admiratif des nouvelles avancées techniques,
            en ergonomie et en design.
            Je crois notamment que le développement des connaissances en "gamification",
            issues des jeux vidéos, permet de mieux véhiculer certaines informations.
            C'est un aspect fondamental de l'environnement de 42.
          </p>
        </Section>
        <Section title="Expérience">
          J'ai travaillé à Sinequa dans le cadre d'une année de césure.
          Sinequa édite une solution permettant d'indexer de grandes quantités
          de données et d'appliquer dessus une variété de modéles,
          comme du machine learning ou de la visualisation.
          <br/>
          Le résultat prend la forme d'un moteur de recherche peronnalisé pour
          les données du client. Étant membre de l'équipe Machine Learning,
          j'étais assigné à de la R&D sur l'Extraction de Relations, un sous
          domaine du NLP (Natural Language Processing).
          <br/>
          Durant cette année j'ai effectué de la veille sur le sujet, puis implémenté un algorithme appelé BREDS en python.
          J'ai également effectué des tickets pour l'outil graphique de création de modèle d'apprentissage.
        </Section>
        <Project name="Transcendance">
          Site web avec un chat et un jeu de pong multijoueur (projet de fin d'études en groupe de 4)
        </Project>
        <Project name="Computor_v2">
          Interpréteur de calculatrice
        </Project>
        <Project name="Containers">
          Implémentation de conteneurs de la librairie standard de C++
        </Project>
        <Project name="Cube3D">
          Jeu pseudo-3D inspiré de Wolfenstein3D
        </Project>
    </Box>
  );
}
