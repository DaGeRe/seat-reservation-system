 wget -O out.json \
    --header="Accept: application/json;odata=verbose" \
    --no-check-certificate \
    --user=r.lehmann_lit \
    --ask-password  \
    "https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle('Kalender%20DeskSharing')/items?$select=RecurrenceData,fRecurrence,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort"

# portal.justiz.sachsen.de  