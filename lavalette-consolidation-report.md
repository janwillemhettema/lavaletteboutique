# Design System Consolidation — Implementatierapport
**La Valette Boutique · 19 juni 2026**

Alle 18 pagina's aangepast. Geen redesign, geen nieuwe features, geen nieuwe libraries — uitsluitend consolidatie van bestaande waardes, zoals gevraagd. JS-syntax gecontroleerd en geldig op alle 18 bestanden na implementatie.

---

## 1. Transition-systeem

**Vorige staat:** 20 losse duraties, van .12s tot 1.8s, zonder patroon.
**Nieuwe staat:** exact 3 waardes — Fast `.2s`, Medium `.4s`, Slow `.8s`.

**Mapping-regel:** ≤300ms → Fast, 301–600ms → Medium, >600ms → Slow (dichtstbijzijnde tier, relatieve snelheidsverhouding tussen elementen blijft behouden).

| Oude waarde | → | Nieuwe waarde |
|---|---|---|
| .1s, .12s, .15s, .18s, .2s, .22s, .25s, .3s | → | **.2s** |
| .35s, .42s, .45s, .5s, .55s, .6s | → | **.4s** |
| .7s, .75s, .9s, 1s, 1.2s, 1.4s, 1.6s, 1.8s, 2s | → | **.8s** |

**Totaal genormaliseerd:** 1.018 individuele duratie-tokens, sitebreed nu nog maar 3 distincte waardes (.2s: 466×, .4s: 486×, .8s: 556×, gecontroleerd na implementatie).

**Let op — meest merkbare wijziging:** een aantal elementen die voorheen zeer traag waren (1.2s–2s, bijvoorbeeld enkele reveal- en parallax-effecten) draaien nu op .8s. Dat is sneller dan voorheen. Dit volgt direct uit de door jou gespecificeerde 3-tier schaal (er was geen "zeer traag"-tier gedefinieerd) — wil je die elementen toch trager houden, dan is dat een gerichte uitzondering die ik er apart uit kan halen.

---

## 2. Letter-spacing-schaal (uppercase labels/kickers/nav)

**Scope:** alleen elementen met `text-transform:uppercase` gecombineerd met `letter-spacing` (labels, kickers, navigatie) — overige typografie is niet aangeraakt, conform "maintain hierarchy".

**Vorige staat:** 16 losse waardes, van .1em tot .36em.
**Nieuwe staat:** 2 waardes — **.18em** (secundair/inline labels) en **.3em** (primaire kickers/sectielabels/navigatie).

**Mapping-regel:** ≤.23em → .18em, >.23em → .3em.

**Totaal genormaliseerd:** 463 instanties. Eindstand sitebreed: .18em (153×), .3em (310×).

---

## 3. Foto-hover-zoom

**Vorige staat:** 5 verschillende scale-waardes (1.01 / 1.03 / 1.05 / 1.06 / 1.07) op mosaic-foto's, room cards, hap-secties en de lv-cards. Duur/easing varieerde ook (.6s ease / .7s / .9s, met cubic-bezier(0,0,.2,1) of cubic-bezier(.4,0,.2,1)).
**Nieuwe staat:** één waarde, **scale(1.04)**, met **.8s var(--ez2)** (de bestaande, al-gevestigde easing-curve die de mosaic-foto's al gebruikten) op alle 8 betrokken regels.

**Bijzondere vondst:** `.room-card:hover .room-img` had twee tegenstrijdige regels (scale 1.03+.6s ease, en later scale 1.06+translateY+filter). Door bron-volgorde in de cascade was de eerste regel al **dood** (overschreven) vóór mijn wijziging. Ik heb beide genormaliseerd voor toekomstige onderhoudbaarheid, ook al was er maar één van de twee daadwerkelijk zichtbaar.

**Behouden, bewust ongewijzigd:** de bijkomende effecten naast de zoom zelf — `translateY(-1%)` en `filter:brightness()/saturate()` op specifieke foto's — zijn niet aangeraakt, dat zijn bestaande nuances, geen onderdeel van "scale".

---

## 4. Border-radius-systeem

**Nieuw systeem:** twee tokens — **Small = 2px** (kaarten, foto-containers, content-blokken) en **Pill = 999px** (CTA-knoppen en badges, gegarandeerd volledig rond ongeacht hoogte).

**Vorige staat → nieuwe staat:**
- 4px (foto-thumbnails, chat-venster kopbalk) → **2px**
- 20px (event-badge) → **999px**
- 30px (nav-CTA, drawer-CTA, room-link) → **999px**

**Bijzondere vondst, sitebreed:** de hoofdnavigatie-knop (`.nav-cta`) was **pil-vormig op index.html maar hoekig (2px) op alle 16 SEO-pagina's** — exact dezelfde knop zag er dus per pagina anders uit. Dit is nu gelijkgetrokken: alle 17 overige pagina's krijgen via de gedeelde stylesheet-laag dezelfde 999px pil-vorm als index.html.

**Bewust uitgesloten:** de asymmetrische hoekvormen van de chat-bubbels (bv. `7px 0 7px 7px`) — dat is een spraakwolk-vorm, geen "kaart" of "knop", en valt buiten de gevraagde scope ("cards, image containers, content blocks, buttons"). Aanpassen daarvan zou het karakter van het chat-widget veranderen.

---

## 5. Toegankelijke focus-states

**Vorige staat:** meerdere klikbare elementen (room-card, lv-card, formuliervelden, kalenderdagen, e.a.) hadden `outline:none` of `outline:none!important` zonder enige vervangende stijl. Slechts 2 losse `:focus`-regels bestonden site-breed, geen enkele `:focus-visible`.

**Nieuwe staat:** één regel, toegevoegd aan de bestaande gedeelde stylesheet-laag op alle 18 pagina's:

```css
outline:1px solid rgba(184,153,112,.75)!important;
outline-offset:2px!important;
border-radius:1px;
```

Toegepast op: links, knoppen, room-card, lv-card, taal-selector, formuliervelden, FAQ-items, kalenderdagen, de Further Discover-titel en de chat-knop.

**Waarom `:focus-visible` in plaats van `:focus`:** deze ring verschijnt alleen bij toetsenbordnavigatie (Tab), niet bij een muisklik — dus subtiel en onopvallend voor de meeste bezoekers, maar volledig duidelijk voor wie met het toetsenbord navigeert.

---

## 6. Image loading-consistentie

**Vorige staat:** het kleine logo in de footer/drawer (72px, op alle 18 pagina's) had geen `loading`-attribuut. Het hoofdlogo in de nav had dit al correct (`loading="eager"`).

**Nieuwe staat:** `loading="lazy" decoding="async"` toegevoegd aan de footer-variant van het logo, op alle 18 pagina's. Elke `<img>`-tag op de site heeft nu een expliciete, bewuste loading-strategie.

---

## 7. Samenvatting

| Categorie | Bestanden aangepast | Inconsistenties verwijderd |
|---|---|---|
| Transition-duraties | 18 / 18 | 20 waardes → 3 (1.018 instanties genormaliseerd) |
| Letter-spacing (kickers) | 18 / 18 | 16 waardes → 2 (463 instanties genormaliseerd) |
| Foto-hover-zoom | 1 / 18 (alleen index.html, enige pagina met deze content) | 5 waardes → 1 (8 instanties) |
| Border-radius | 18 / 18 | 5 waardes → 2 tokens + cross-page nav-CTA-vorm gelijkgetrokken (17 pagina's) |
| Focus-states | 18 / 18 | 0 → 18 (volledig nieuwe, consistente dekking) |
| Image loading | 18 / 18 | 18 ontbrekende attributen toegevoegd |

**Totaal aantal individuele waarde-correcties: ruim 1.550, verspreid over 18 bestanden.**

### Resterende uitzonderingen (bewust ongewijzigd)
1. Chat-bubbel hoekvormen (7px-gebaseerd, asymmetrisch) — buiten scope, vormbepalend voor het chat-widget.
2. Drie overlappende reveal-trigger-classes (`.vis`/`.in`/`.is-visible`) — werken nog steeds correct samen, maar zijn niet samengevoegd in deze pas (stond niet in de zes gevraagde punten).
3. De zeer trage animaties (1.2s–2s) die nu op .8s draaien — zie waarschuwing bij punt 1. Als dit bij het bekijken te snel aanvoelt, geef ik dat gericht een eigen, hogere waarde terug.

Geen visuele identiteit, typografie-familie, lay-out, of SEO-content is aangeraakt.
