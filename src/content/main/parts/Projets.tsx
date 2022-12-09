import { PropsWithChildren } from "react";
import "./Projects.css";

type ProjetProps = {
  title: string,
  tags: string[],
  image: string,
  githubLink: string,
}
function Projet(props: ProjetProps & PropsWithChildren) {
  return (
    <a
      className="project col-xs-12 col-sm-6 col-md-4 col-lg-4"
      href={props.githubLink}
    >
      <span className="title">{props.title}</span>
      <div className="img">
        <img src={props.image}/>
      </div>
      <div className="description">
        {props.children}
      </div>
      <span className="tags">{props.tags.join(" | ")}</span>
    </a>
  );
}
// Site web avec un chat et un jeu de pong multijoueur (projet de fin d'études en groupe de 4)
// Interpréteur de calculatrice
// Implémentation de conteneurs de la librairie standard de C++
// Jeu pseudo-3D inspiré de Wolfenstein3D

export function Projets() {
  return (
    <div className="row section topspace" id="projects">
      <h2 className="section-title"><span>Projets</span></h2>

      <div className="container thumbnails">
        <div className="row">
          <Projet
            title="Transcendance"
            tags={["site web", "websocket", "jeu-vidéo"]}
            image="images/transcendence.png"
            githubLink="https://github.com/DoomDuck/transcendence"
          >
              Site web avec un chat et un jeu de pong multijoueur
              (projet de fin d'études en groupe de 4)
          </Projet>
          <Projet
            title="Computor_v2"
            tags={["lexer/parser"]}
            image="images/calculator-icon.png"
            githubLink="https://github.com/luckylu91/computorv1-2"
          >
              Interpréteur de calculatrice
          </Projet>
          <Projet
            title="Containers"
            tags={["librairie standard c++"]}
            image="images/containers.png"
            githubLink="https://github.com/luckylu91/ft_containers"
          >
              Implémentation de conteneurs de la librairie standard de C++
          </Projet>
          <Projet
            title="Cub3D"
            tags={["jeu-vidéo", "ray casting"]}
            image="images/cube3d.png"
            githubLink="https://github.com/luckylu91/cub3d"
          >
              Jeu pseudo-3D inspiré de Wolfenstein3D
          </Projet>
        </div>
      </div>
    </div>
  );
}
