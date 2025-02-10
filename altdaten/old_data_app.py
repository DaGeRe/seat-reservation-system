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
import re

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
        series_bookings = ''
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
                                # E.g. Alle 14 Tag(e) or Alle 1 Woche(n) am: Mittwoch
                                if 'Alle ' in recurrence:
                                    # E.g. Alle 1 Woche(n) am: Mittwoch
                                    if 'am: ' in recurrence:
                                        freq = recurrence.split('Alle ')[1].split(' Woche')[0]
                                        weekday = recurrence.split('am: ')[1]
                                        if weekday == 'Montag':
                                            weekday = 0
                                        if weekday == 'Dienstag':
                                            weekday = 1
                                        if weekday == 'Mittwoch':
                                            weekday = 2
                                        if weekday == 'Donnerstag':
                                            weekday = 3
                                        if weekday == 'Freitag':
                                            weekday = 4
                                        series_bookings += f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}|{freq}|{weekday}|weekly\n'
                                    # E.g. Alle 14 Tag(e)
                                    else:
                                        freq = recurrence.split('Alle ')[1].split(' Tag')[0]
                                        series_bookings += f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}|{freq}||daily\n'
                                else:
                                    freq = recurrence.split('weekFrequency="')[1].split('" /></repeat>')[0]
        
                                    weekday = recurrence.split('<recurrence><rule><firstDayOfWeek>')[1].split('</firstDayOfWeek>')[0]
                                    if weekday == 'mo':
                                        weekday = 0
                                    if weekday == 'di':
                                        weekday = 1
                                    if weekday == 'mi':
                                        weekday = 2
                                    if weekday == 'do':
                                        weekday = 3
                                    if weekday == 'fr':
                                        weekday = 4
                                    series_bookings += f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}|{freq}|{weekday}|weekly\n'
                            else:
                                single_bookings += f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}\n'
                        except:
                            # Anmelder is not known in users.json therefore not known to AD -> ignore
                            unknown += f'{anmelder}|{start}|{end}|{recurrence}\n'
                            pass

        with open(self.output_dir + 'unknownn.txt', 'w') as text_file:
            text_file.write(unknown)
        with open(self.output_dir + 'single_bookings.txt', 'w') as text_file:
            text_file.write(single_bookings)
        with open(self.output_dir + 'series_bookings.txt', 'w') as text_file:
            text_file.write(series_bookings)


    def get_headers(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        login_url = f'{base_url}/users/login'

        response = requests.post(
            login_url, 
            json={
                'email': os.getenv('TEST_MAIL'),
                'password': os.getenv('TEST_PW')
            }, 
            headers={
                'Content-Type': 'application/json'
            }, 
            verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt'
        )

        if response.status_code != 200:
            print('login failed. test user exists?')
            return
        

        json_obj = response.json()
        jwt = json_obj['accessToken']
        # Headers with the Authorization field
        headers = {
            "Authorization": f"Bearer {jwt}",
            "Content-Type": "application/json"  # or another appropriate content type
        }

        return headers

    def execute_series_bookings(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        headers = self.get_headers()

    def execute_single_bookings(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        headers = self.get_headers()

        bookings_url  = f'{base_url}/bookings/addBookingSimplified'

        users_not_found = set()
        room_not_found = set()
        desk_not_found = set()
        booking_already_there = []
        booking_done = []

        with open(self.output_dir + 'single_bookings.txt', 'r') as text_file:
            for line in text_file:
                line_arr = line.strip().split('|')
                #f'{start}|{end}|{email}|{standort}|{raumnummer}|{arbeitsplatz}\n'
                start = line_arr[0]
                end = line_arr[1]
                email = line_arr[2]
                standort = line_arr[3]
                raumnummer = 'Raum ' + line_arr[4]
                arbeitsplatz = line_arr[5]
                #print(start)
                data = {
                    'day': start.split('T')[0],
                    'start': start.split('T')[1].split('Z')[0],
                    'end': end.split('T')[1].split('Z')[0],
                    'email': email,
                    'building': standort,
                    'roomRemark': raumnummer,
                    'deskRemark': arbeitsplatz
                }

                

                # Sending the POST request with headers
                response = requests.post(bookings_url, json=data, headers=headers, verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt')
                if response.status_code == 500:
                    if 'User not found for ' in response.text:
                        users_not_found.add(response.text.split('User not found for ')[1])
                        continue
                    if 'Desk not found for ' in response.text:
                        desk_not_found.add(response.text.split('Desk not found for ')[1])
                        continue
                    if 'Room not found for ' in response.text:   
                        room_not_found.add(response.text.split('Room not found for ')[1])
                        continue
                    if 'Booking already there ' in response.text:
                        booking_already_there.append(response.text.split('Booking already there ')[1])
                        continue
                else:
                    booking_done.append(response.text.split('Booking done ')[1])
                    print(response.status_code, response.text)
        print('fin1')
        # Write all data to files.
        with open(self.output_dir + 'single_bookings/users_not_found.txt', 'w') as f:
            for item in users_not_found:
                f.write(item + '\n')  
        with open(self.output_dir + 'single_bookings/desks_not_found.txt', 'w') as f:
            for item in desk_not_found:
                f.write(item + '\n')  
        with open(self.output_dir + 'single_bookings/rooms_not_found.txt', 'w') as f:
            for item in room_not_found:
                f.write(item + '\n')  
        with open(self.output_dir + 'single_bookings/booking_already_there.txt', 'w') as f:
            for item in booking_already_there:
                f.write(item + '\n')      
        with open(self.output_dir + 'single_bookings/bookings_done.txt', 'w') as f:
            for item in booking_done:
                f.write(item + '\n') 
        print('fin2')
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
            nb - execute normal bookings
            sb - execute series bookings
        ''')
        key = input()
        if key == 'l':
            app.load_json_from_www()
        if key == 'e':
            app.extract_infos()
        elif key == 'nb':
            app.execute_single_bookings()
        elif key == 'sb':
            app.execute_series_bookings()
        elif key == 'q':
            print('Bye')
            break
        