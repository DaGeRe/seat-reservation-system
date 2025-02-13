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
        self.url = 'https://portal.justiz.sachsen.de/lit/litport/organisation/abt1/ds/_api/web/lists/getbytitle(\'Kalender%20DeskSharing\')/items?$select=ID,RecurrenceData,fRecurrence,RecurrenceID,MasterSeriesItemID,EventType,Duration,EventDate,EndDate,Anmelder/Name,Arbeitsplatz/Title,Raumnummer/Title,Standort/Title&$expand=Anmelder,Arbeitsplatz,Raumnummer,Standort'
        self.username = 'r.lehmann_lit'
        load_dotenv(env_file)
        pass 

    def load_json_from_www(self):
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
        with open(self.users_json, 'r', encoding='utf-8') as file:
            users = json.load(file)

        normal_bookings = []
        series_bookings = []
        no_mail_bookings = []

        files = [os.path.join(self.old_data_dir, f) for f in os.listdir(self.old_data_dir) if os.path.isfile(os.path.join(self.old_data_dir, f))]
        for file in files:
            with open(file, 'r', encoding='utf-8') as f:
                datasets = json.load(f)['d']['results']
                for dataset in datasets:
                    anmelder = dataset['Anmelder']['Name'].split('i:0#.w|justiz\\')[1] #+ '@lit.justiz.sachsen.de'
                    obj = {
                        'ID': dataset['ID'],
                        'Standort': dataset['Standort']['Title'],
                        'Raumnummer': dataset['Raumnummer']['Title'],
                        'Arbeitsplatz': dataset['Arbeitsplatz']['Title'],
                        'Anmelder': anmelder,
                        'EventDate': dataset['EventDate'],
                        'EndDate': dataset['EndDate'],
                        'fRecurrence': dataset['fRecurrence'],
                        'EventType': dataset['EventType'],
                        'RecurrenceID': dataset['RecurrenceID'],
                        'Duration': dataset['Duration'],
                        'RecurrenceData': dataset['RecurrenceData'],
                        'MasterSeriesItemID': dataset['MasterSeriesItemID'],
                        'firstName': users[anmelder.upper()]['Givenname'] if anmelder.upper() in users.keys() else None, #users[anmelder.upper()]['Givenname'],
                        'lastName': users[anmelder.upper()]['Surname'] if anmelder.upper() in users.keys() else None, #users[anmelder.upper()]['Surname'],
                        'email': users[anmelder.upper()]['EmailAddress'] if anmelder.upper() in users.keys() else None # users[anmelder.upper()]['EmailAddress']
                    }
                    
                    if not (obj['Raumnummer'] and obj['Arbeitsplatz']):
                        continue
                    
                    if not (obj['firstName'] and obj['lastName'] and obj['email']):
                        no_mail_bookings.append(obj)
                        continue

                    if obj['EventType'] == 0:
                        normal_bookings.append(obj)
                    else:
                        series_bookings.append(obj)

        with open(self.output_dir + '/no_mail_bookings.json', 'w', encoding='utf-8') as f:
            json.dump(no_mail_bookings, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings.json', 'w', encoding='utf-8') as f:
            json.dump(series_bookings, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/normal_bookings.json', 'w', encoding='utf-8') as f:
            json.dump(normal_bookings, f, indent=4, ensure_ascii=False)

    def execute_single_bookings(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        headers = self.get_headers()
        bookings_url  = f'{base_url}/bookings/addBookingSimplified'

        user_not_found = []
        desk_not_found = []
        room_not_found = []
        booking_already_there = []
        booking_done = []

        with open(self.output_dir + '/normal_bookings.json', 'r', encoding='utf-8') as file:
            normal_bookings = json.load(file)
        
        for normal_booking in normal_bookings:
            # Skip chemnitz, ...
            if 'Bautzner' not in  normal_booking['Standort']:
                continue
            data = {
                'day': normal_booking['EventDate'].split('T')[0],
                'start': normal_booking['EventDate'].split('T')[1].split('Z')[0],
                'end': normal_booking['EndDate'].split('T')[1].split('Z')[0],
                'email': normal_booking['email'],
                'building': normal_booking['Standort'],
                'roomRemark': 'Raum ' + normal_booking['Raumnummer'],
                'deskRemark': normal_booking['Arbeitsplatz']
            }
            # Sending the POST request with headers
            response = requests.post(bookings_url, json=data, headers=headers, verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt')
            if response.status_code == 500:
                if 'User not found for ' in response.text:
                    user_not_found.append(normal_booking)
                    continue
                if 'Desk not found for ' in response.text:
                    desk_not_found.append(normal_booking)
                    continue
                if 'Room not found for ' in response.text:   
                    room_not_found.append(normal_booking)
                    continue
                if 'Booking already there ' in response.text:
                    booking_already_there.append(normal_booking)
                    continue
            else:
                booking_done.append(normal_booking)
        
        with open(self.output_dir + '/normal_bookings/user_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(user_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/normal_bookings/desk_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(desk_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/normal_bookings/room_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(room_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/normal_bookings/booking_already_there.json', 'w', encoding='utf-8') as f:
            json.dump(booking_already_there, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/normal_bookings/booking_done.json', 'w', encoding='utf-8') as f:
            json.dump(booking_done, f, indent=4, ensure_ascii=False)

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

    def execute_exceptions(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        headers = self.get_headers()
        booking_url  = f'{base_url}/bookings'

        booking_not_found = []
        misc_error = []
        ok = []

        with open(self.output_dir + '/series_bookings.json', 'r', encoding='utf-8') as f:
            series_bookings = json.load(f)
        
        for series_booking in series_bookings:
            if 'Bautzner' not in  series_booking['Standort']:
                continue

            # Not deleted or exception of a recurring event
            if series_booking['EventType'] != 3 and series_booking['EventType'] != 4:
                continue
            
            
            url = f'{booking_url}/deleteByMailAndDateAndDeskRemark/{series_booking["email"]}/{series_booking["EventDate"].split("T")[0]}/{series_booking["Arbeitsplatz"]}'
            response = requests.post(url, headers=headers, verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt')
            if response.status_code != 200:
                print('not able to delete booking as exception.', url)
                continue

            if 'OK' == response.text:
                ok.append(series_booking)
            elif 'booking not found' == response.text:
                booking_not_found.append(series_booking)
            else:
                misc_error.append(series_booking)

        with open(self.output_dir + '/series_bookings_exception/ok.json', 'w', encoding='utf-8') as f:
            json.dump(ok, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings_exception/booking_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(booking_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings_exception/misc.json', 'w', encoding='utf-8') as f:
            json.dump(misc_error, f, indent=4, ensure_ascii=False)

    def execute_series_bookings(self):
        ip =  os.getenv('IP')
        backend_port =  os.getenv('BACKEND_PORT')
        base_url = f'https://{ip}:{backend_port}'
        headers = self.get_headers()
        dates_url  = f'{base_url}/series/dates'
        series_url  = f'{base_url}/series'

        exceptions = []
        deleted_instance_of_recurring_event = []
        room_not_found = []
        desk_not_found = []
        not_able = []
        ok = []

        with open(self.output_dir + '/series_bookings.json', 'r', encoding='utf-8') as f:
            series_bookings = json.load(f)
        
        for series_booking in series_bookings:
            if 'Bautzner' not in  series_booking['Standort']:
                continue
            # Recurrence exception
            if series_booking['EventType'] == 4:
                # handle later
                pass
            # Deleted instance of a recurring event
            if  series_booking['EventType'] == 3:
                #handle later
                pass
            # Recurring event
            if series_booking['EventType'] == 1:
                frequency = ''
                dayOfTheWeek = ''
                if 'weekly' in series_booking['RecurrenceData']:
                    dayOfTheWeek = series_booking['RecurrenceData'].split('<weekly ')[1].split('="TRUE" ')[0]
                    if dayOfTheWeek == 'mo':
                        dayOfTheWeek = 0
                    elif dayOfTheWeek == 'tu':
                        dayOfTheWeek = 1
                    elif dayOfTheWeek == 'we':
                        dayOfTheWeek = 2
                    elif dayOfTheWeek == 'th':
                        dayOfTheWeek = 3
                    elif dayOfTheWeek == 'fr':
                        dayOfTheWeek = 4
                    
                    frequency = 'weekly'
                    repeat = int(series_booking['RecurrenceData'].split('weekFrequency="')[1].split('" /></repeat>')[0])
                    if repeat == 2:
                        frequency = 'twoweeks'
                    elif repeat == 3:
                        frequency = 'threeweeks'
                    elif repeat == 4:
                        frequency = 'monthly'
                elif 'daily' in series_booking['RecurrenceData']:
                    repeat = series_booking['RecurrenceData'].split('dayFrequency="')[1].split('" /></repeat>')[0]
                    frequency = 'daily'
                    if repeat == 7:
                        frequency = weekly
                    elif repeat == 14:
                        frequency = 'twoweeks'
                    elif repeat == 21:
                        frequency = 'threeweeks'
                    elif repeat == 28:
                        frequency = 'monthly'
                else:
                    # Wether weekly nor daily.
                    continue

                data = {
                    'startDate': series_booking['EventDate'],
                    'endDate': series_booking['EndDate'],
                    'startTime' : series_booking['EventDate'].split('T')[1].split('Z')[0],
                    'endTime': series_booking['EndDate'].split('T')[1].split('Z')[0],
                    'frequency': frequency,
                    'dayOfTheWeek': dayOfTheWeek
                }
                response = requests.post(dates_url, json=data, headers=headers, verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt')
                if response.status_code != 200:
                    print('not able to fetch date.', data)
                    continue
                dates = response.json()
                
                data = {
                    'deskRemark': series_booking['Arbeitsplatz'],
                    'email':series_booking['email'],
                    'rangeDTO': {
                        'startDate': series_booking['EventDate'],
                        'endDate': series_booking['EndDate'],
                        'startTime' : series_booking['EventDate'].split('T')[1].split('Z')[0],
                        'endTime': series_booking['EndDate'].split('T')[1].split('Z')[0],
                        'frequency': frequency,
                        'dayOfTheWeek': dayOfTheWeek
                    },
                    'dates': dates
                }
                url = f'{series_url}/createSeriesForDeskRemark'
                response = requests.post(url, json=data, headers=headers, verify=f'{os.getenv("PATH_TO_TLS")}/ca.crt')
                if response.status_code != 200:
                    print('not able to create series.\n', url, '\n', data, '\n', response.status_code)
                    continue
                
                if 'OK' == response.text:
                    ok.append(series_booking)
                elif 'cannot find desk' == response.text:
                    desk_not_found.append(series_booking)
                elif 'cannot find room' == response.text:
                    room_not_found.append(series_booking)
                elif 'cannot create series' == response.text:
                    not_able.append(series_booking)
        
        with open(self.output_dir + '/series_bookings/desk_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(desk_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings/room_not_found.json', 'w', encoding='utf-8') as f:
            json.dump(room_not_found, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings/not_able.json', 'w', encoding='utf-8') as f:
            json.dump(not_able, f, indent=4, ensure_ascii=False)
        with open(self.output_dir + '/series_bookings/ok.json', 'w', encoding='utf-8') as f:
            json.dump(ok, f, indent=4, ensure_ascii=False)

if __name__ == '__main__':
    app = App('old_data', 
        'users.json', 
        'output/', 
        '../.env'
    )
    while True:
        print('''
            q - quit
            l - load .json from server
            e - extract informations
            nb - execute normal bookings
            sb - execute series bookings
            ex - execute exceptions for series bookings
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
        elif key == 'ex':
            app.execute_exceptions()
        elif key == 'q':
            print('Bye')
            break
        