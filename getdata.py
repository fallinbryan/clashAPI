import requests
import json

#the following token only works from my ip address space
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImZmMmJjOTc3LWIzYmYtNGFmNi1hM2E2LTJiM2FiYWMxNzY0MyIsImlhdCI6MTUzMjAwMDQ0NCwic3ViIjoiZGV2ZWxvcGVyL2I4ODMxNWYzLWJhMjktMGI1Yy0zZGRmLTZlNjgzMjA4NWMxYSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjY5LjE2Ny4xODguMTI5IiwiNjYuMTc1LjE0Ny40Il0sInR5cGUiOiJjbGllbnQifV19.jaSeSBYRoBuFVzjBz-BAvsPW8CRWBwRnGN4tBUknCFJU3Iac-g8oow8ihu06M1in-W4hJa_zKCdY-PyP216VzA"


clanTag = ''  #inxput clan tag here
clanTag = clanTag.replace('#','%23')

header = {'Accept': 'application/json', 'authorization': 'Bearer {}'.format(token)}
url = 'https://api.clashofclans.com/v1/clans/{}'.format(clanTag)
app_request = requests.get(url, header)
result = app_request.json()
output = 'var data = ' + app_request.text
with open('clan.json','w') as jsonFile: 
    jsonFile.write(output)
	
memberTags = []
for member in result['memberList']: 
    memberTags.append(member['tag'].replace('#','%23'))
	
output = 'var memberData = {"memberList":['

for tag in memberTags:
    url = 'https://api.clashofclans.com/v1/players/{}'.format(tag)
    #print(url)
    app_request = requests.get(url,header)
    output += app_request.text + ','
	
output += ']}'

with open('players.json','w') as jsonFile: 
    jsonFile.write(output)