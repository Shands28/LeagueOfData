APIkey = 'RGAPI-874d0a8b-b46a-4349-8af6-c98831b55bf9'

URL = 'https://{}.api.riotgames.com'

summonerCall = '/lol/summoner/v4/summoners/by-name/{}?api_key={}'
leagueCall = '/lol/league/v4/entries/by-summoner/{}?api_key={}'  # encryptedSummonerId
matchesCall = '/lol/match/v4/matchlists/by-account/{}?api_key={}&season=13&endIndex=50'
matchesNextCall = '/lol/match/v4/matchlists/by-account/{}?api_key={}&season=13&beginIndex={}'  # encryptedAccountId
matchCall = '/lol/match/v4/matches/{}?api_key={}'
