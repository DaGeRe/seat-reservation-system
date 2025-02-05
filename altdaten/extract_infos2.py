import os
import json
import re



def map_anmelder(anmelder, dump_content, anmelder_complete):
    name = ['m.frosch_lit@lit.justiz.sachsen.de',
    'k.schneider_lit@lit.justiz.sachsen.de',
    'k.langhammer_lit@lit.justiz.sachsen.de',
    'r.hahn_lit@lit.justiz.sachsen.de',
    'a.schloeffel_lit@lit.justiz.sachsen.de',
    's.kramer_veps@lit.justiz.sachsen.de',
    'm.beck_lit@lit.justiz.sachsen.de',
    'h.ismail_lit@lit.justiz.sachsen.de',
    'c.lange_lit@lit.justiz.sachsen.de',
    'c.herzog_lit@lit.justiz.sachsen.de',
    'k.freudenberg_lit@lit.justiz.sachsen.de',
    'r.wojtkowiak_lit@lit.justiz.sachsen.de',
    'j.eisermann_lit@lit.justiz.sachsen.de',
    'r.weber_lit@lit.justiz.sachsen.de',
    'k.paschke_lit@lit.justiz.sachsen.de',
    's.forgber_lit@lit.justiz.sachsen.de',
    'j.engel_lit@lit.justiz.sachsen.de',
    'a.leppuhner_lit@lit.justiz.sachsen.de',
    'e.dietz_lit@lit.justiz.sachsen.de',
    'k.mothes_lit@lit.justiz.sachsen.de',
    'f.moebius_lit@lit.justiz.sachsen.de',
    'a.geisler_lit@lit.justiz.sachsen.de',
    'k.rosenbaum_lit@lit.justiz.sachsen.de',
    'd.hahn_lit@lit.justiz.sachsen.de',
    'a.leuner_lit@lit.justiz.sachsen.de',
    'b.naefe_lit@lit.justiz.sachsen.de',
    'l.eckart_lit@lit.justiz.sachsen.de',
    'd.dorn_lit@lit.justiz.sachsen.de',
    'i.ueberall_lit@lit.justiz.sachsen.de',
    'u.thomas_lit@lit.justiz.sachsen.de',
    'h.keilig_lit@lit.justiz.sachsen.de',
    'a.krappidel_lit@lit.justiz.sachsen.de',
    'y.wachsmuth_lit@lit.justiz.sachsen.de',
    'b.ritter_lit@lit.justiz.sachsen.de',
    'h.totz_lit@lit.justiz.sachsen.de',
    'm.pierschel_lit@lit.justiz.sachsen.de',
    'b.ruehl_lit@lit.justiz.sachsen.de',
    'r.schneider_lit@lit.justiz.sachsen.de',
    't.frost_lit@lit.justiz.sachsen.de',
    'c.welz_lit@lit.justiz.sachsen.de',
    'c.graefe_lit@lit.justiz.sachsen.de',
    'l.paschold_lit@lit.justiz.sachsen.de',
    'v.schulze_veps@lit.justiz.sachsen.de',
    'd.lindner_veps@lit.justiz.sachsen.de',
    's.manthey_lit@lit.justiz.sachsen.de',
    'i.oehlmann_lit@lit.justiz.sachsen.de',
    'g.uhlemann_lit@lit.justiz.sachsen.de',
    't.hadamietz_lit@lit.justiz.sachsen.de',
    'g.tomaschek_lit@lit.justiz.sachsen.de',
    's.heyme_lit@lit.justiz.sachsen.de',
    'g.neubert-wetzel_lit@lit.justiz.sachsen.de',
    'a.neumann_lit@lit.justiz.sachsen.de',
    'i.leppuhner_lit@lit.justiz.sachsen.de',
    't.schneider_lit@lit.justiz.sachsen.de',
    'n.lebek_lit@lit.justiz.sachsen.de',
    'j.schuetze_lit@lit.justiz.sachsen.de',
    'm.essler_lit@lit.justiz.sachsen.de',
    'l.goerner_lit@lit.justiz.sachsen.de',
    'f.bartl_lit@lit.justiz.sachsen.de',
    'o.klotz_lit@lit.justiz.sachsen.de',
    'r.vaupel_lit@lit.justiz.sachsen.de',
    's.mueller_lit@lit.justiz.sachsen.de',
    'p.gietzelt_lit@lit.justiz.sachsen.de',
    'f.kasper_lit@lit.justiz.sachsen.de',
    'a.fiebig_lit@lit.justiz.sachsen.de',
    'f.landgraf_lit@lit.justiz.sachsen.de',
    's.lohse_lit@lit.justiz.sachsen.de',
    'l.helbig_lit@lit.justiz.sachsen.de',
    't.boettrich_lit@lit.justiz.sachsen.de',
    't.hegewald_lit@lit.justiz.sachsen.de',
    'm.brenner_lit@lit.justiz.sachsen.de',
    'e.seregi_lit@lit.justiz.sachsen.de',
    's.wendt_lit@lit.justiz.sachsen.de'
    ]


    first_letter = anmelder.split('.')[0]
    lastname = anmelder.split('.')[1].split('_lit')[0]

    if first_letter == 'v' and lastname == 'schulze_veps':
        return 'vicky.schulze@veps-vollzug.justiz.sachsen.de'
    if first_letter == 's' and lastname == 'kramer_veps':
        return 'susan.kramer@veps-vollzug.justiz.sachsen.de'
    if first_letter == 'd' and lastname == 'lindner_veps':
        return 'daniel.lindner@veps-vollzug.justiz.sachsen.de'
    if first_letter == 'r' and lastname == 'hahn':
        return 'Richard.Hahn@lit.justiz.sachsen.de'
    if first_letter == 'r' and lastname == 'schneider':
        return 'Ralf.Schneider@lit.justiz.sachsen.de'
    if first_letter == 'd' and lastname == 'hahn':
        return 'Diana.Hahn@lit.justiz.sachsen.de'
    if first_letter == 't' and lastname == 'schneider':
        return 'Tom.Schneider@lit.justiz.sachsen.de'

    pattern = rf'{first_letter}.+{lastname}@lit\.justiz\.sachsen\.de'
    matches = re.findall(pattern, dump_content, re.IGNORECASE)
    if not matches:
        lastname=lastname.split('_')[0]
        print('Fail: ', first_letter, lastname, anmelder_complete, '\n\t')
        return None 
    elif len(matches) != 1:
        print(first_letter, lastname, anmelder_complete, '\n\t', len(matches))
        return matches[0]
    else:
        return matches[0]

anm = set()
source_dir = 'data2'
files = [os.path.join(source_dir, f) for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]

with open('simple.sql', 'w') as simple:
    with open('users.txt', 'r') as dump:
        dump_content = dump.read()
        for file in files:
            with open(file, 'r', encoding='utf-8') as f:
                #content = f.read() 
                datasets = json.load(f)['d']['results']
                for dataset in datasets:
                    # print(dataset.keys()) 
                    # dict_keys(['__metadata', 'Standort', 'Raumnummer', 'Arbeitsplatz', 'Anmelder', 'EventDate', 'EndDate', 'fRecurrence', 'RecurrenceData'])
                    standort = dataset['Standort']['Title']
                    raumnummer = dataset['Raumnummer']['Title']
                    arbeitsplatz = dataset['Arbeitsplatz']['Title']
                    if arbeitsplatz == None:
                        continue
                    anmelder = dataset['Anmelder']['Name'].split('i:0#.w|justiz\\')[1] #+ '@lit.justiz.sachsen.de'
                    start = dataset['EventDate']
                    end = dataset['EndDate']
                    recurrence = dataset['RecurrenceData']
                    
                    my_str =  ''
                    
                    if '2025' in end:
                        anmelder = map_anmelder(anmelder, dump_content, dataset['Anmelder'])
                        start_date = start.split('T')[0]
                        start_time = start.split('T')[1].split('Z')[0]
                        end_date = end.split('T')[0]
                        end_time = end.split('T')[1].split('Z')[0]
                        user_id = f'(select id from users where email=\'{anmelder}\')'
                        desk_id = f'(select desk_id from desks where remark=\'{arbeitsplatz}\')'
                        room_id = f'(select room_id from desks where remark=\'{arbeitsplatz}\')'
                        
                        if recurrence == None:
                            #print(start_date, start_time, end_date, end_time)
                            query = f'insert into bookings (begin,day,end,lock_expiry_time,desk_id,room_id,user_id,series_id,booking_in_progress)'+\
                            f'values(\'{start_time}\', \'{start_date}\', \'{end_time}\', NULL,{desk_id},{room_id},{user_id},NULL,\'\');\n'
                            #print(query)
                            simple.write(query + '\n')
                            #print(desk_id, arbeitsplatz)
                        else:
                            '''
                            Wed Jan 29 2025 10:25:34 GMT+0100 (Mitteleuropäische Normalzeit) 
                            Wed Jan 29 2025 10:25:34 GMT+0100 (Mitteleuropäische Normalzeit) 
                            '12:00:00' '14:00:00' 'daily' '''

                            query = f'insert into series (end_date, end_time, frequency, start_date, start_time, desk_id, room_id)'+\
                            f'values({end_date},{end_time}.000000);'
                            #print(anmelder, start_date, start_time, end_date, end_time, recurrence, arbeitsplatz)
                            print(recurrence)
                            pass



#for a in anm:
#    print(a)