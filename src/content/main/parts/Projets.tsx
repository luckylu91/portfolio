import { PropsWithChildren } from "react";

type ProjetProps = {
  title: string,
  tags: string[],
  image: string,
  // description: string,
}
function Projet(props: ProjetProps & PropsWithChildren) {
  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
      <a className="thumbnail" href="sidebar-right.html">
        <span className="img">
          <img src={props.image} alt="" />
          {/* <span className="cover"><span className="more">See details &rarr;</span></span> */}
        </span>
        <span className="title">{props.title}</span>
      </a>
      <span className="tags">
        {props.tags.join(" | ")}
      </span>
    </div>
  );
}
// Site web avec un chat et un jeu de pong multijoueur (projet de fin d'études en groupe de 4)
// Interpréteur de calculatrice
// Implémentation de conteneurs de la librairie standard de C++
// Jeu pseudo-3D inspiré de Wolfenstein3D

export function Projets() {
  return (
    <div className="row section recentworks topspace" id="projects">

          <h2 className="section-title"><span>Projets</span></h2>

          <div className="thumbnails recentworks row">

            <Projet title="Transcendance" tags={[]} image="images/transcendence.png">
              Site web avec un chat et un jeu de pong multijoueur (projet de fin d'études en groupe de 4)
            </Projet>
            <Projet title="Computor_v2" tags={[]} image="images/calculator-icon.png">
              Interpréteur de calculatrice
            </Projet>
            <Projet title="Containers" tags={[]} image="images/containers.png">
              Implémentation de conteneurs de la librairie standard de C++
            </Projet>
            <Projet title="Cube3D" tags={[]} image="images/cube3d.png">
              Jeu pseudo-3D inspiré de Wolfenstein3D
            </Projet>

            {/* <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <a className="thumbnail" href="sidebar-right.html">
                <span className="img">
                  <img src="assets/images/s1.jpg" alt="" />
                  <span className="cover"><span className="more">See details &rarr;</span></span>
                </span>
                <span className="title">Transcendance</span>
              </a>
              <span className="tags"><a href="">Web design</a> | <a href="">Wordpress</a> | <a href="">Logotype</a></span>
            </div>

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <a className="thumbnail" href="sidebar-right.html">
                <span className="img">
                  <img src="assets/images/s1.jpg" alt="" />
                  <span className="cover"><span className="more">See details &rarr;</span></span>
                </span>
                <span className="title">Computor_v2</span>
              </a>
              <span className="tags"><a href="">Web design</a> | <a href="">Wordpress</a></span>
            </div>

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <a className="thumbnail" href="sidebar-right.html">
                <span className="img">
                  <img src="assets/images/s1.jpg" alt="" />
                  <span className="cover"><span className="more">See details &rarr;</span></span>
                </span>
                <span className="title">Containers</span>
              </a>
              <span className="tags"><a href="">Web design</a> | <a href="">Logotype</a></span>
            </div>

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <a className="thumbnail" href="sidebar-right.html">
                <span className="img">
                  <img src="assets/images/s1.jpg" alt="" />
                  <span className="cover"><span className="more">See details &rarr;</span></span>
                </span>
                <span className="title">Cube3D</span>
              </a>
              <span className="tags"><a href="">Web design</a> | <a href="">Wordpress</a></span>
            </div> */}

          </div>

        </div>

  );
}

// <div className="row section featured topspace">
//   <h2 className="section-title"><span>Projets</span></h2>
//   <div className="row">
//     <div className="col-sm-6 col-md-3">
//       <h3 className="text-center">Transcendance</h3>
//       <p>Site web avec un chat et un jeu de pong multijoueur (projet de fin d'études en groupe de 4)</p>
//       <p className="text-center"><a href="" className="btn btn-action">Read more</a></p>
//     </div>
//     <div className="col-sm-6 col-md-3">
//       <h3 className="text-center">Computor_v2</h3>
//       <p>Interpréteur de calculatrice</p>
//       <p className="text-center"><a href="" className="btn btn-action">Read more</a></p>
//     </div>
//     <div className="col-sm-6 col-md-3">
//       <h3 className="text-center">Containers</h3>
//       <p>Implémentation de conteneurs de la librairie standard de C++</p>
//       <p className="text-center"><a href="" className="btn btn-action">Read more</a></p>
//     </div>
//     <div className="col-sm-6 col-md-3">
//       <h3 className="text-center">Cube3D</h3>
//       <p>Jeu pseudo-3D inspiré de Wolfenstein3D</p>
//       <p className="text-center"><a href="" className="btn btn-action">Read more</a></p>
//     </div>
//   </div>
// </div>
