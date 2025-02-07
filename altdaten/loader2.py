import requests
from bs4 import BeautifulSoup
import os
import getpass
from requests.auth import HTTPBasicAuth
from urllib.parse import urljoin
import requests
from requests_ntlm import HttpNtlmAuth
import json
'''
    downlod the ressource specified by url.
    If in the last line an following ressource is named, it is also downloaded.
    Authentitication with username and password. Distinction of different documents with out_num.

'''
def func(username, password, url, out_num=0):
    # Ntlm authentication is importand!
    auth = HttpNtlmAuth(username, password)
    # We want json.
    response = requests.get(url, auth=auth, headers={'Accept': 'application/json;odata=verbose'}, verify=False)
    if response.status_code == 200:
        # Die JSON-Antwort in eine Datei schreiben
        filename = f'old_data/out_{out_num:02d}'+'.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(response.json(), f, ensure_ascii=False, indent=4)
            try:
                func(username, password, response.json()["d"]["__next"], out_num+1)
            except:
                pass
                
        print(f'JSON was written to {filename}.')
    else:
        print(f'Fehler: {response.status_code}')

url = 'https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle(\'Kalender%20DeskSharing\')/items?$select=RecurrenceData,fRecurrence,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort'
username = 'r.lehmann_lit'
password = getpass.getpass("Enter your password: ")
func(username, password, url)


    