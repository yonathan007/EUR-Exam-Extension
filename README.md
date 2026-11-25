# EUR Exam Companion v0.3.3 (GitHub Edition)

Afzonderlijke Chrome-extensie voor de EUR Exam Launcher en geconfigureerde examenwebsites. **De Exam Launcher is niet gewijzigd.**

## Functies
- Tools-menu, taalkeuze Nederlands/Engels, lokale tijd en technische-hulptekst.
- Op externe examenpagina’s: **Examen sluiten** met een bevestiging en waarschuwing voor mogelijk verlies van niet-opgeslagen antwoorden en voortgang. Bevestiging navigeert naar de launcher.
- **Batterijstatus:** percentage en oplaadstatus in het Tools-menu, als de Battery Status API beschikbaar is.
- **Waarschuwing bij 15% of lager**, **kritiek bij 5% of lager**. Een compacte indicator verschijnt op de Tools-knop, en de melding in het menu. Meldingen blokkeren het examen niet.
- Bij stijging boven de drempel verdwijnen de betreffende waarschuwingen. Ook tijdens opladen blijven de drempels van toepassing.
- Wanneer batterijgegevens niet toegankelijk zijn, meldt het menu dit zonder een fictief percentage te tonen.

## Installatie en test
1. Pak de ZIP uit.
2. Open `chrome://extensions`, schakel ontwikkelaarsmodus in en kies **Load unpacked**.
3. Schakel eerdere Companion-versies uit om dubbele Tools-knoppen te vermijden.
4. Open een toegestane testpagina en controleer het Tools-menu.
5. Test de Battery Status API op de beoogde beheerde Acer Chromebook. ChromeOS-kioskondersteuning en het tonen van content scripts moeten afzonderlijk worden gevalideerd.

## Beperkingen
- `navigator.getBattery()` is niet gegarandeerd beschikbaar in een content script of kioskcontext. Beschikbaarheid kan afhangen van browser, permissies en beleid.
- Batterijgegevens worden alleen lokaal getoond; er worden geen gegevens verstuurd.
- Terugnavigeren naar de launcher beëindigt niet gegarandeerd het examen op de server of een AVD-sessie.
- Examenantwoorden en exameninstellingen worden niet gewijzigd.

## Ondersteunde aanvullende websites
- `https://engine.surfconext.nl/` (SURFconext; Tools-menu beschikbaar op dit domein).

## Versiegeschiedenis
- **v0.2.7:** SURFconext `engine.surfconext.nl` toegevoegd aan toegestane websites.
- **v0.2.6:** batterijstatus, waarschuwing ≤15%, kritiek ≤5%, NL/EN en nette fallback.
- **v0.2.5:** overbodige toelichting uit Tools-menu verwijderd.
- **v0.2.3:** standalone Tools-menu met bevestiging bij examen verlaten.

## v0.2.8
- Versienummer in kleine letters onderaan het Tools-menu.
- Lokale tijd toont nu ook de datum van vandaag in de gekozen taal.
- Alle overige functies ongewijzigd.

## v0.2.9
Datum en lokale tijd worden op afzonderlijke regels weergegeven.

## v0.3.0
Op de EUR Exam Launcher verschijnt het batterijpercentage direct links naast Tools (indien de Battery Status API beschikbaar is). Op andere examenwebsites blijft het percentage in het menu en verschijnen lage-batterijbadges zoals voorheen. Bij ontbrekende browserondersteuning wordt buiten het menu geen percentage getoond. De launcherbestanden zijn niet gewijzigd.

## v0.3.1
Verbergt de lege batterij-indicator bij ontbrekende Battery Status API. Als navigator.getBattery() niet beschikbaar is, kan de extensie het percentage niet betrouwbaar tonen; ChromeOS-beleid/browsercontext controleren. Launcher ongewijzigd.

## v0.3.3 — GitHub
Gebaseerd op v0.3.1. Update-URL toegevoegd en zichtbaar versienummer gecorrigeerd. Geen sleutel of buildscript meegeleverd.

1. Upload de uitgepakte bestanden naar de root van de repository EUR-Exam-Companion.
2. Activeer Settings > Pages > Deploy from a branch > main / (root).
3. Voor lokale tests: Load unpacked via chrome://extensions.
4. Voor beheerde installatie: publiceer een ondertekend CRX-bestand en maak updates.xml met de werkelijke app-ID, CRX-URL en versie 0.3.3. Gebruik de update-URL uit het manifest. Deze bestanden zijn niet meegeleverd; GitHub Pages alleen installeert geen extensie.
5. Test of Custom URL beschikbaar is voor de specifieke kioskwebapp.

Publiceer nooit private sleutels. De batterijbeperking uit v0.3.1 blijft bestaan.
