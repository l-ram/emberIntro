/** eslint-disable prettier/prettier */
import Component from "@glimmer/component";
import { AuCard, AuHeading } from "appuniversum/ember-appuniversum";

export default class GraphVizComponent extends Component {
  get title() {
    return this.args.title ?? "Nope";
  }
}

    <template>
    <aside>
    <div class="au-o-grid__item au-u-1-2@small">
  <AuCard @textCenter="true" as |c|>
    <c.header @badgeSkin="brand" @badgeIcon="eye">
      <AuHeading @level="3" @skin="4">
        Graph Visualisation
      </AuHeading>

    </c.header>

    <c.content />
    <c.footer />
  </AuCard>
</div>
</aside>
</template>
