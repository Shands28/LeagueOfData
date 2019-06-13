# coding=utf-8
import time

from pymongo import MongoClient
import json
import requests
import env

client = MongoClient('localhost', 27017)
database = client['LeagueOfData']
collection_matches = database['matches']
collection_summoner = database['summoners']
start_time = time.time()


def main():
    print 'entra'
    for match in collection_matches.find({'$or': [{"queueId": 420}, {"queueId": 420}], "participants.highestAchievedSeasonTier": "CHALLENGER", "participants.championId": 7}):
        for player in match['participantIdentities']:
            summonerName = '' + player['player']['summonerName']
            print summonerName
            json_summoner = requestSummonerID('euw1', summonerName.encode('utf-8'))
            print("SummonerID: --- %s seconds ---" % (time.time() - start_time))
            time.sleep(1)
            if json_summoner.has_key(''):
                print ''
            if collection_summoner.find_one({'id': json_summoner['id']}) is None:
                data = {}
                data['id'] = json_summoner['id']
                data['accountId'] = json_summoner['accountId']
                data['summonerName'] = json_summoner['name']
                data['summonerLevel'] = json_summoner['summonerLevel']
                data['profileIconId'] = json_summoner['profileIconId']
                data['region'] = 'euw1'
                json_ranks = requestRanks('euw1', json_summoner['id'])
                print("ranks: --- %s seconds ---" % (time.time() - start_time))
                data['ranks'] = json_ranks
                collection_summoner.insert_one(data)
                accountId = data['accountId']
                matchList = requestMatchList('euw1', accountId)
                if len(matchList) > 0:
                    for match in matchList:
                        if collection_matches.find_one({'gameId': match['gameId']}) is None:
                            match_r = requestSingleMatch('euw1', match['gameId'])
                            if match_r.status_code == 200:
                                match_j = match_r.json()
                                collection_matches.insert_one(match_j)
                                print("Sleep: --- %s seconds ---" % (time.time() - start_time))
                            time.sleep(1.1)
                        else:
                            print 'Match in Database'
                    else:
                        print 'No matches found'
            else:
                print("Summoner in Database: --- %s seconds ---" % (time.time() - start_time))


def requestSummonerID(region, summonerName):
    response = requests.get(env.URL.format(region) + env.summonerCall.format(summonerName, env.APIkey))
    print 'Summoner OK' if response.status_code == 200 else response.json()
    return response.json() if response.status_code == 200 else exit()


def requestRanks(region, summonerId):
    response = requests.get(env.URL.format(region) + env.leagueCall.format(summonerId, env.APIkey))
    print 'Rank OK' if response.status_code == 200 else response.json()
    return response.json() if response.status_code == 200 else {'ranks': []}


def requestMatchList(region, accountId):
    response = requests.get(env.URL.format(region) + env.matchesCall.format(accountId, env.APIkey))
    print 'MatchList OK' if response.status_code == 200 else response.json()
    if response.status_code == 404:
        return []
    response_json = response.json()
    matches = response_json['matches']
    return matches


def requestSingleMatch(region, matchId):
    response = requests.get(env.URL.format(region) + env.matchCall.format(matchId, env.APIkey))
    return response


if __name__ == '__main__':
    main()
