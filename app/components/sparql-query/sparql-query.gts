/** eslint-disable ember/no-empty-glimmer-component-classes */
/** eslint-disable prettier/prettier */
import Component from "@glimmer/component";
import { AuCard, AuHeading, AuTextarea } from "appuniversum/ember-appuniversum";

export default class SparqlQueryComponent extends Component {



<template>
  <aside>
<div class="au-o-grid__item au-u-1-2@small">
  <AuCard @textCenter="true" as |c|>
    <c.header @badgeSkin="brand" @badgeIcon="draft">
      <AuHeading @level="3" @skin="4">
        SPARQL Query
      </AuHeading>

    </c.header>
    <c.content>

      <AuTextarea value={{@query}} />

    </c.content>
    <c.footer>
      <p>
        <a
          class="au-c-button"
          href="#!"
          rel="noopener noreferrer"
          target="_blank"
        >Submit</a>
      </p>
    </c.footer>
  </AuCard>
</div>
</aside>
</template>;
}
