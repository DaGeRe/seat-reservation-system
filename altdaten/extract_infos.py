offset = 89
import xmltodict
import json

def extract_rooms(entries):
    room_set = set()
    for entry in entries:
        standortListItem = str(entry['link'][1]['m:inline']['entry']['content']['m:properties']['d:Title'])
        raumnummerListItem = str(entry['link'][2]['m:inline']['entry']['content']['m:properties']['d:Title'])
        #arbeitsplatznummerListItem = str(entry['link'][3]['m:inline']['entry']['content']['m:properties']['d:Title'])
        #room_str = standortListItem + ' | ' + raumnummerListItem + ' | ' + arbeitsplatznummerListItem
        room_str = standortListItem + ' | ' + raumnummerListItem
        if 'null' not in room_str:
            room_set.add(room_str)

    for i in room_set:
        print(i)
def extract_entry(entry):
    standortListItem = str(entry['link'][1]['m:inline']['entry']['content']['m:properties']['d:Title'])
    raumnummerListItem = str(entry['link'][2]['m:inline']['entry']['content']['m:properties']['d:Title'])
    arbeitsplatznummerListItem = str(entry['link'][3]['m:inline']['entry']['content']['m:properties']['d:Title'])
    userInfoItem = str(entry['link'][4]['m:inline']['entry']['content']['m:properties']['d:Name'])
    start_Date = str(entry['content']['m:properties']['d:EventDate']['#text'])
    end_Date = str(entry['content']['m:properties']['d:EndDate']['#text'])
    #print(start_Date, end_Date)
    super_str = userInfoItem + '\n' + standortListItem + " | " + raumnummerListItem + " | " + arbeitsplatznummerListItem + "\n" + start_Date + "\n" + end_Date
    #print(userInfoItem)
    if 'null' not in super_str:
        print(super_str)
        print('########################')
    #print(standortListItem, raumnummerListItem, arbeitsplatznummerListItem, userInfoItem)
with open('data_pretty.xml', 'r') as file:
    content = xmltodict.parse(file.read())
    #print(content['feed'])
    id = content['feed']['id']
    titles = content['feed']['title']
    updates = content['feed']['updated']
    entries = content['feed']['entry']
    links = content['feed']['link']
    #extract_entry_(entries[0])
    for entry in entries:
        extract_entry(entry)
    #extract_rooms(entries)