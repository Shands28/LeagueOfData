# {summonerName: 'schurle3'}
from pymongo import MongoClient
import time

client = MongoClient('localhost', 27017)
database = client['LeagueOfData']
collection_summoner = database['summoner']
collection_matches = database['matches']
collection_championStats = database['championstats']

championsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56, 57,
                  58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 89,
                  90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117, 119,
                  120, 121, 122, 126, 127, 131, 133, 134, 136, 141, 142, 143, 145, 150, 154, 157, 161, 163, 164, 201,
                  202, 203, 222, 223, 236, 238, 240, 245, 254, 266, 267, 268, 350, 412, 420, 421, 427, 429, 432, 497,
                  498, 516, 517, 518, 555]


def main():
    start_time = time.time()
    for i in championsArray:
        total = collection_matches.find({'$or': [{"queueId": 420}, {"queueId": 440}],
                                         'participants.championId': i}).count()
        total_ranked = collection_matches.find({'$or': [{"queueId": 420}, {"queueId": 440}]}).count()
        if total > 0:
            wins = collection_matches.find(
                {'$or': [{"queueId": 420}, {"queueId": 440}],
                 'participants': {'$elemMatch': {'championId': i, 'stats.win': True}}}).count()
            bans = collection_matches.find(
                {"$or": [{"queueId": 420}, {"queueId": 440}], "teams.bans.championId": i}).count()
            print 'ChampionId: ' + str(i) + ' wins: ' + str(wins) + ' total: ' + str(total)
            print 'Bans: ' + str(bans)
            win_rate_total = round(((wins * 1.0) / total) * 100, 1)
            ban_rate_total = round(((bans * 1.0) / total_ranked) * 100, 1)
            pick_rate_total = round(((total * 1.0) / total_ranked) * 100, 1)
            champion_stats = {
                "championId": i,
                "win_rate": win_rate_total,
                "ban_rate": ban_rate_total,
                "pick_rate": pick_rate_total,
                'goldTotal': 0,
                'minionsKilledTotal': 0,
                'kda': 0,
                'matchesTotal': 0
            }
            collection_championStats.update({'championId': i + 1}, champion_stats, True)
            print 'WinRate: ' + str(win_rate_total) + ' BanRate: ' + str(ban_rate_total) + ' PickRate: ' + str(
                pick_rate_total)

    print collection_matches.find({'$or': [{"queueId": 420}, {"queueId": 440}]}).count()
    for match in collection_matches.find({'$or': [{"queueId": 420}, {"queueId": 440}]}):
        print 'Match'
        for participant in match['participants']:
            kda = (participant['stats']['kills'] + participant['stats']['assists']) / participant['stats']['deaths'] if \
                participant['stats']['deaths'] else participant['stats']['kills'] + participant['stats']['assists']
        collection_championStats.update_one({'championId': participant['championId']}, {
            '$inc': {'goldTotal': participant['stats']['goldEarned'],
                     'minionsKilledTotal': participant['stats']['totalMinionsKilled'],
                     'kda': kda,
                     'matchesTotal': 1}})
    print("End: --- %s seconds ---" % (time.time() - start_time))


if __name__ == '__main__':
    main()
