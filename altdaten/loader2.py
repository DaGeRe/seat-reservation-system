import requests
from bs4 import BeautifulSoup
import os
import getpass
from requests.auth import HTTPBasicAuth
from urllib.parse import urljoin
import requests
from requests_ntlm import HttpNtlmAuth
import json

def func(username, password, url, out_num=0):
    auth = HttpNtlmAuth(username, password)

    # Anfrage senden
    response = requests.get(url, auth=auth, headers={'Accept': 'application/json;odata=verbose'}, verify=False)
    print(response.status_code)
    if response.status_code == 200:
        print("Erfolgreiche Anfrage!")
        # Die JSON-Antwort in eine Datei schreiben
        with open('data2/out_'+f'{out_num:02d}'+'.json', 'w', encoding='utf-8') as f:
            json.dump(response.json(), f, ensure_ascii=False, indent=4)
            try:
                func(username, password, response.json()["d"]["__next"], out_num+1)
            except:
                pass
                
        print("JSON wurde in out.json gespeichert.")
    else:
        print(f"Fehler: {response.status_code}")

url = 'https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle(\'Kalender%20DeskSharing\')/items?$select=RecurrenceData,fRecurrence,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort'
username = 'r.lehmann_lit'
password = getpass.getpass("Enter your password: ")
func(username, password, url)


    