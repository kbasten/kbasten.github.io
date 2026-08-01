# Website Kawthoolei Landmeters

Statische site: HTML, CSS en een beetje JavaScript. Geen build-stap, geen
framework, geen externe diensten. Openen kan door `index.html` in een browser
te slepen; online zetten door de hele map `website/` naar de webhosting te
kopiëren.

```
website/
├── index.html      alle inhoud staat op deze ene pagina
├── css/style.css
├── js/main.js      menu, galerij, lightbox, scroll-effecten
└── img/            geoptimaliseerde foto's en logovarianten
```

## Nog invullen voordat de site live gaat

In `index.html` staan drie placeholders. Die zijn op de site **geel
gemarkeerd** zodat ze niet per ongeluk blijven staan. Vervang de waarde en
haal het attribuut `data-invullen` weg:

| Waar | Nu | Moet worden |
|---|---|---|
| footer, KvK | `<span data-invullen>00000000</span>` | jouw KvK-nummer |
| footer, btw-id | `<span data-invullen>NL000000000B00</span>` | jouw btw-identificatienummer |
| footer, werkgebied | "heel Nederland" | klopt dit? |

Zodra de gele markering nergens meer staat, is alles ingevuld.

### Aannames die ik heb gedaan — controleer deze

Deze stonden niet in de conceptteksten; ik heb ze ingevuld omdat de pagina er
anders gaten in had. Pas ze aan als ze niet kloppen:

- **Werkgebied** (sectie "Over ons"): "Heel Nederland, met de nadruk op
  Zeeland, Zuid-Holland en Noord-Brabant". Afgeleid uit de foto's (Deltawerken,
  Zeelandbrug) — niet uit iets wat je hebt aangeleverd.
- **"Reactie meestal binnen één werkdag"** bij het e-mailadres. Alleen laten
  staan als je dat waar kunt maken.
- **"Duidelijke oplevering"** (blok 04 bij Werkwijze), inclusief de vermelding
  van BIM. Weghalen als je geen digitale bestanden aanlevert.
- **Nulmetingen bestaande bouw** en **revisiemetingen** in de dienstenlijst.

### Domein

De `<link rel="canonical">`, de Open Graph-tags en de bedrijfsgegevens onderaan
`index.html` gaan uit van `https://www.kawthoolei.nl/`. Wordt het een ander
domein, pas dan die URL's aan (zoek op `kawthoolei.nl`).

## Foto's

De 20 galerijfoto's, het sfeerbeeld en de hero zijn met `../build-images.sh`
uit `materialen/` gegenereerd: verkleind, gecomprimeerd en van EXIF ontdaan
(locatiegegevens uit de telefoonfoto's staan er dus niet meer in).

Andere foto's gebruiken: pas de lijst onderaan `build-images.sh` aan en draai
het script opnieuw. De bestandsnamen `werk-01` t/m `werk-20` corresponderen
één-op-één met de volgorde in de galerij in `index.html`; vergeet niet de
`alt`-tekst en het bijschrift (`data-caption`) mee aan te passen.

Eén foto uit de map is bewust **niet** gebruikt: op `IMG-20260801-WA0000.jpg`
is de naamsticker op de helm leesbaar.

## Wat de JavaScript doet

Alles is aanvulling, geen voorwaarde: met JavaScript uit blijft de site
volledig leesbaar en bruikbaar (de galerij toont dan simpelweg alle foto's
meteen). Verder: uitklapmenu op mobiel, meelopende markering in het menu,
galerij inklappen met "Toon alle foto's", lightbox met pijltjestoetsen en
veegbediening, en de zwevende belknop op mobiel.

## Bekende beperkingen

- **Het logo is een JPEG van 331×341 px.** Daaruit zijn het beeldmerk en de
  favicon gesneden. Op grote schermen is dat scherp genoeg, maar een
  vectorversie (SVG of AI/EPS) zou beter zijn. Het woordmerk "KAWTHOOLEI
  Landmeters" in de header en footer is daarom opgemaakte tekst en geen
  afbeelding — dat is op elk scherm scherp.
- **Er is geen contactformulier**, bewust: een statische site kan geen formulier
  verwerken zonder externe dienst. Bezoekers bellen, mailen of appen direct.
  Wil je later toch een formulier, dan is Formspree of FormSubmit de kleinste
  stap.
- **Geen cookies, geen trackers, geen externe verzoeken.** De site laadt
  uitsluitend eigen bestanden, dus een cookiemelding is niet nodig. Voeg je
  later Google Analytics of ingesloten kaarten toe, dan verandert dat en heb je
  wel een cookiemelding en een privacyverklaring nodig.
