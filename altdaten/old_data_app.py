'''
Extract informations from .json files regarding series bookings
and normal bookings.
'''
import os
import json
import re
import getpass
from requests_ntlm import HttpNtlmAuth
import requests
from dotenv import load_dotenv

class App:
    def __init__(self,old_data_dir,users_json, output_dir,env_file):
        self.old_data_dir = old_data_dir
        self.users_json = users_json
        self.output_dir = output_dir
        self.url = 'https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle(\'Kalender%20DeskSharing\')/items?$select=RecurrenceData,fRecurrence,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort'
        self.username = 'r.lehmann_lit'
        load_dotenv(env_file)
        pass 

    def load_json_from_www(self):
        url = 'https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle(\'Kalender%20DeskSharing\')/items?$select=RecurrenceData,fRecurrence,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort'
        username = 'r.lehmann_lit'
        password = getpass.getpass("Enter your password: ")
        # Ntlm authentication is importand!
        auth = HttpNtlmAuth(self.username, password)
        self.load_json_from_www_rec(auth, self.url)
        print('####Finished load_json_from_www')

    def load_json_from_www_rec(self, auth, url, out_num=0):
        # We want json.
        response = requests.get(url, auth=auth, headers={'Accept': 'application/json;odata=verbose'}, verify=False)
        if response.status_code == 200:
            # Die JSON-Antwort in eine Datei schreiben
            filename = f'{self.old_data_dir}/out_{out_num:02d}'+'.json'
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(response.json(), f, ensure_ascii=False, indent=4)
                try:
                    self.load_json_from_www_rec(auth, response.json()["d"]["__next"], out_num+1)
                except:
                    pass 
            print(f'JSON was written to {filename}.')
        else:
            print(f'Error: {response.status_code}')

    def extract_infos(self):
        unknown = ''
        single_bookings = ''
        known_map = {}
        with open(self.users_json, 'r', encoding='utf-8') as file:
            users = json.load(file)
            files = [os.path.join(self.old_data_dir, f) for f in os.listdir(self.old_data_dir) if os.path.isfile(os.path.join(self.old_data_dir, f))]
            for file in files:
                with open(file, 'r', encoding='utf-8') as f:
                    datasets = json.load(f)['d']['results']
                    for dataset in datasets:
                        standort = dataset['Standort']['Title']
                        raumnummer = dataset['Raumnummer']['Title']
                        arbeitsplatz = dataset['Arbeitsplatz']['Title']
                        if arbeitsplatz == None:
                            continue
                        anmelder = dataset['Anmelder']['Name'].split('i:0#.w|justiz\\')[1] #+ '@lit.justiz.sachsen.de'
                        start = dataset['EventDate']
                        end = dataset['EndDate']
                        recurrence = dataset['RecurrenceData']
                        firstName = ''
                        lastName = ''
                        email = '' 
                        try:
                            first_name = users[anmelder.upper()]['Givenname']
                            lastName = users[anmelder.upper()]['Surname']
                            email = users[anmelder.upper()]['EmailAddress']
                            if recurrence:
                                pass
                            else:
                                formatted_start = start.split('T')[1].split('Z')[0]
                                formatted_end = end.split('T')[1].split('Z')[0]
                                #single_bookings += f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}\n'
                                single_bookings += f'''insert into bookings (begin,booking_in_progress,day,end,lock_expiry_time,desk_id,room_id,user_id,series_id) values(
    time('{formatted_start}'), 
    '', 
    date('{start.split('T')[0]}'), 
    time('{formatted_end}'), 
    NULL, 
    (select desk_id from desks where remark = '{arbeitsplatz}'),
    (select room_id from rooms where remark = 'Raum {raumnummer}'),
    (select id from users where email = '{email}'),
    NULL
);\n'''
                        except:
                            # Anmelder is not known in users.json therefore not known to AD -> ignore
                            unknown += f'{anmelder}|{start}|{end}|{recurrence}\n'
                            pass

        with open(self.output_dir + 'unknownn.txt', 'w') as text_file:
            text_file.write(unknown)
        with open(self.output_dir + 'single_bookings.txt', 'w') as text_file:
            text_file.write(single_bookings)

    def execute_single_bookings(self):
        pw = os.getenv('TEST_PW')
        email =  os.getenv('TEST_MAIL')
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        login_url = f'{base_url}/users/login'

        login_data = {
            'email': email,
            'password': pw
        }
        proxies = {
            'http': 'http://proxy.justiz.sachsen.de:3128',
            'https': 'http://proxy.justiz.sachsen.de:3128',
        }

         # Ntlm authentication is importand!
        auth = HttpNtlmAuth(email, pw)
        #response = requests.get(url, auth=auth, headers={'Accept': 'application/json;odata=verbose'}, verify=False)
        

        #response = requests.post(login_url, data=login_data, proxies=proxies)
        response = requests.post(login_url, auth=auth, proxies=proxies)
        if response.status_code == 200:
            print(response)
        else:
            print('fail')

if __name__ == '__main__':
    app = App('old_data', 
        'users.json', 
        'output/', 
        '/home/r/DeskSharingTool_Dev/.env'
    )
    while True:
        print('''
            q - quit
            l - load .json from server
            e - extract informations
            sb - execute single bookings
        ''')
        key = input()
        if key == 'l':
            app.load_json_from_www()
        if key == 'e':
            app.extract_infos()
        elif key == 'sb':
            app.execute_single_bookings()
        elif key == 'q':
            print('Bye')
            break
        