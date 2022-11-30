import React, { useRef, useState } from 'react';
import { Movement, parseMovementString } from './animations/rubik/utils/movements';
import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import logo from './logo.svg';
import { Project } from './Project';
import { Section } from './Section';

function App() {
  let [movements, setMovements] = useState<Movement[]>([]);
  let inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value  = inputRef.current!.value;
    const parsedMovements = parseMovementString(value);
    if (parsedMovements === null) {
      console.error("Invalid movements string");
    }
    else {
      setMovements(parsedMovements);
    }
  }

  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <RubikScrollAnimation size={500}/>
      <Section title="Profil">
        <p>
          Je suis passionné de science et de logique depuis ma jeunesse.
          J'ai débuté l'informatique au lycée grâce à lesiteduzero.com (novellement openclassroom).
          Par la suite j'ai fait beaucoup de math et de physique en prépa et en école d'ingénieur.
          J'avais considéré poursuivre en Machine Learning mais j'ai rapidement admis que c'était le développement qui était fait pour moi.
          Aujourd'hui je cherche des projets qui me challenge de la conception à la réalisation, et j'aimerais les faire dans une équipe dynamique et qui a la même passion que moi.
        </p>
      </Section>
      <Section title="À propos de moi">
        <p>
          Mon type d'humour c'est l'absurde, et de peinture le surréalisme.
          J'adore le cinéma.
          Il m'arrive d'essayer d'exprimer ma créativité "artistique"
        </p>
      </Section>
      <Section title="Jeux vidéo">
        <p>
          Depuis petit je suis baigné dans l'univers des jeux vidéo: les consoles portables, les discussions à l'école, les soirées entre amis.
          Aujourd'hui les occasions et les impulsions de jouer se raréfient de plus en plus.
          Néanmoins je pense que ce média m'attire toujours et j'aimerais faire une partie de ma carière à essayer d'en développer.
          Je suis admiratif des avancées récentes en technique et en ergonomie, en game design.
        </p>
      </Section>

      <Section title="Expérience">
        {/* <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada ultrices ligula in mattis. Morbi et tristique augue. Donec pulvinar congue felis, et bibendum augue placerat eget. Duis quis rhoncus eros, vitae suscipit dui. Quisque vehicula ultrices dictum. Mauris lectus felis, ultricies ut ipsum eu, luctus sollicitudin velit. Quisque a lacus ut erat semper placerat ornare in dolor. Phasellus nec odio convallis arcu congue viverra id suscipit felis. Aliquam consectetur turpis vitae viverra varius. Duis venenatis in nunc ut consectetur. Praesent tincidunt ante at enim tempus tempor. In non feugiat orci, eu consectetur nibh.
        </p>
        <p>
          Praesent eget nibh in enim efficitur placerat. Nullam non erat sem. Phasellus viverra urna sed orci interdum sodales. Quisque congue vestibulum mauris, ac vulputate erat fringilla ut. Nam pharetra at erat sit amet lacinia. Nunc metus odio, suscipit sed justo in, dignissim lacinia odio. In mollis in metus sed varius. Nulla ullamcorper, elit id rutrum faucibus, nunc orci lobortis libero, id faucibus ipsum erat at odio. Vivamus porttitor, erat eu varius imperdiet, purus justo blandit lectus, vel ultricies ex dolor sed urna. Vestibulum aliquet nibh felis, at ultrices nisl vehicula quis. Pellentesque commodo augue quis magna tincidunt, id vulputate metus finibus. Vestibulum a elit in nunc faucibus sollicitudin.
        </p>
        <p>
          Mauris tellus ante, elementum eget auctor vulputate, malesuada dignissim felis. Integer sollicitudin, dolor id tempor maximus, augue ipsum rutrum mi, sed aliquet magna felis vel mi. Morbi lacinia ac libero nec feugiat. Cras congue mauris orci, pretium viverra elit efficitur et. Vestibulum facilisis, nisl venenatis consectetur euismod, urna velit tempor tortor, sit amet rutrum nunc diam quis ex. Quisque cursus tristique nulla sit amet tincidunt. Curabitur blandit pharetra enim et tincidunt.
        </p>
        <p>
          Donec elementum felis justo, quis imperdiet eros luctus nec. Curabitur turpis sapien, ornare id cursus nec, suscipit vel massa. Quisque fringilla eros quis nisi finibus, in volutpat tortor malesuada. Aliquam erat volutpat. Morbi fringilla felis justo, a blandit turpis convallis id. Curabitur ut semper erat, id dapibus ipsum. Praesent arcu elit, tristique vel elementum eu, viverra quis elit. Integer vel arcu eget augue gravida aliquam non in lorem. Nullam pharetra vestibulum condimentum. Ut commodo porta ornare. Quisque vel mollis neque. Suspendisse lorem risus, egestas eget tempus id, tempor et orci. Pellentesque quis facilisis lectus. Sed sit amet tincidunt ligula. Duis cursus iaculis nunc eget elementum.
        </p>
        <p>
          Nullam sollicitudin justo nec massa iaculis lobortis. Donec ut euismod sem. Nam iaculis volutpat dictum. Donec feugiat dui eu magna aliquam consectetur. Donec pellentesque massa arcu. Maecenas dictum imperdiet quam non ultrices. Donec vestibulum commodo lectus in sodales. Fusce sagittis tellus quis felis commodo tincidunt. Vivamus ultricies, enim vitae porttitor luctus, mi augue efficitur sapien, ut auctor justo odio in est. Fusce sagittis dignissim neque quis placerat. Donec mollis lorem ac tellus congue, in sagittis nulla blandit. Morbi ultricies ipsum sit amet enim venenatis, ac eleifend nisi dictum. Aenean volutpat auctor libero, vitae rutrum massa mattis id. Morbi dictum justo eu lorem tristique, sit amet fringilla lacus mattis.
        </p> */}
        J'ai travaillé à Sinequa dans le cadre d'une année de césure.
        Sinequa édite une solution incluant notamment un moteur de recherche, déstinée à une utilisation en interne dans les réseaux de leurs clients.
        Le travail que j'ai effectué consistait à de la Recherche et Développement dans l'Extraction de Relations entre Entités Nommées, un sous domaine du NLP (Natural Language Processing).
        J'étais en autonomie et j'ai implémenté un algorithme appelé BREDS en python.
        J'ai également effectué des tickets pour la solution de l'entreprise.
      </Section>
      <Section title='lalala'>
      <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada ultrices ligula in mattis. Morbi et tristique augue. Donec pulvinar congue felis, et bibendum augue placerat eget. Duis quis rhoncus eros, vitae suscipit dui. Quisque vehicula ultrices dictum. Mauris lectus felis, ultricies ut ipsum eu, luctus sollicitudin velit. Quisque a lacus ut erat semper placerat ornare in dolor. Phasellus nec odio convallis arcu congue viverra id suscipit felis. Aliquam consectetur turpis vitae viverra varius. Duis venenatis in nunc ut consectetur. Praesent tincidunt ante at enim tempus tempor. In non feugiat orci, eu consectetur nibh.
        </p>
        <p>
          Praesent eget nibh in enim efficitur placerat. Nullam non erat sem. Phasellus viverra urna sed orci interdum sodales. Quisque congue vestibulum mauris, ac vulputate erat fringilla ut. Nam pharetra at erat sit amet lacinia. Nunc metus odio, suscipit sed justo in, dignissim lacinia odio. In mollis in metus sed varius. Nulla ullamcorper, elit id rutrum faucibus, nunc orci lobortis libero, id faucibus ipsum erat at odio. Vivamus porttitor, erat eu varius imperdiet, purus justo blandit lectus, vel ultricies ex dolor sed urna. Vestibulum aliquet nibh felis, at ultrices nisl vehicula quis. Pellentesque commodo augue quis magna tincidunt, id vulputate metus finibus. Vestibulum a elit in nunc faucibus sollicitudin.
        </p>
        <p>
          Mauris tellus ante, elementum eget auctor vulputate, malesuada dignissim felis. Integer sollicitudin, dolor id tempor maximus, augue ipsum rutrum mi, sed aliquet magna felis vel mi. Morbi lacinia ac libero nec feugiat. Cras congue mauris orci, pretium viverra elit efficitur et. Vestibulum facilisis, nisl venenatis consectetur euismod, urna velit tempor tortor, sit amet rutrum nunc diam quis ex. Quisque cursus tristique nulla sit amet tincidunt. Curabitur blandit pharetra enim et tincidunt.
        </p>
        <p>
          Donec elementum felis justo, quis imperdiet eros luctus nec. Curabitur turpis sapien, ornare id cursus nec, suscipit vel massa. Quisque fringilla eros quis nisi finibus, in volutpat tortor malesuada. Aliquam erat volutpat. Morbi fringilla felis justo, a blandit turpis convallis id. Curabitur ut semper erat, id dapibus ipsum. Praesent arcu elit, tristique vel elementum eu, viverra quis elit. Integer vel arcu eget augue gravida aliquam non in lorem. Nullam pharetra vestibulum condimentum. Ut commodo porta ornare. Quisque vel mollis neque. Suspendisse lorem risus, egestas eget tempus id, tempor et orci. Pellentesque quis facilisis lectus. Sed sit amet tincidunt ligula. Duis cursus iaculis nunc eget elementum.
        </p>
        <p>
          Nullam sollicitudin justo nec massa iaculis lobortis. Donec ut euismod sem. Nam iaculis volutpat dictum. Donec feugiat dui eu magna aliquam consectetur. Donec pellentesque massa arcu. Maecenas dictum imperdiet quam non ultrices. Donec vestibulum commodo lectus in sodales. Fusce sagittis tellus quis felis commodo tincidunt. Vivamus ultricies, enim vitae porttitor luctus, mi augue efficitur sapien, ut auctor justo odio in est. Fusce sagittis dignissim neque quis placerat. Donec mollis lorem ac tellus congue, in sagittis nulla blandit. Morbi ultricies ipsum sit amet enim venenatis, ac eleifend nisi dictum. Aenean volutpat auctor libero, vitae rutrum massa mattis id. Morbi dictum justo eu lorem tristique, sit amet fringilla lacus mattis.
        </p>
      </Section>
    </div>
  );
}

export default App;
