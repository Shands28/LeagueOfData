# coding=utf-8
import json
import requests
import time
from pymongo import MongoClient
import env

start_time = time.time()

summoner_queue = ['Ya esta bien']


def main():
    start_time = time.time()
    name = summoner_queue.pop(0)  # str(raw_input('Summoner name: '))
    region = 'euw1'  # str(raw_input('Region: '))
    data = {}
    client = MongoClient('localhost', 27017)
    db = client['LeagueOfData']
    collection_summoner = db['summoners']
    collection_match = db['matches']

    json_summoner = requestSummonerID(region, name)
    print("SummonerID: --- %s seconds ---" % (time.time() - start_time))
    if json_summoner['id'] != -1:
        if collection_summoner.find_one({'id': json_summoner['id']}) is None:
            data['id'] = json_summoner['id']
            data['accountId'] = json_summoner['accountId']
            data['summonerName'] = json_summoner['name']
            data['summonerLevel'] = json_summoner['summonerLevel']
            data['profileIconId'] = json_summoner['profileIconId']
            data['region'] = region

            json_ranks = requestRanks(region, json_summoner['id'])
            print("ranks: --- %s seconds ---" % (time.time() - start_time))
            data['ranks'] = json_ranks
            matchList = requestMatchList(region, json_summoner['accountId'])
            print("matchList: --- %s seconds ---" % (time.time() - start_time))

            collection_summoner.insert_one(data)
            if len(matchList) > 0:
                for match in matchList:
                    if collection_match.find_one({'gameId': match['gameId']}) is None:
                        match_r = requestSingleMatch(region, match['gameId'])
                        if match_r.status_code == 200:
                            match_j = match_r.json()
                            if len(summoner_queue) < 5:
                                summonerName = '' + match_j['participantIdentities'][0]['player']['summonerName']
                                summoner_queue.append(summonerName.encode('utf-8'))
                                print str(len(summoner_queue)) + ' ' + str(summoner_queue)
                            collection_match.insert_one(match_j)
                            print("Sleep: --- %s seconds ---" % (time.time() - start_time))
                        time.sleep(1)
                    else:
                        print 'Match in Database'
            else:
                print 'No matches found'
        else:
            print 'Summoner in Database'
            accountId = collection_summoner.find_one({'id': json_summoner['id']})['accountId']
            matchList = requestMatchList(region, accountId)
            print("matchList: --- %s seconds ---" % (time.time() - start_time))
            collection_summoner.insert_one(data)
            if len(matchList) > 0:
                for match in matchList:
                    if collection_match.find_one({'gameId': match['gameId']}) is None:
                        match_r = requestSingleMatch(region, match['gameId'])
                        if match_r.status_code == 200:
                            match_j = match_r.json()
                            if len(summoner_queue) < 5:
                                summonerName = '' + match_j['participantIdentities'][0]['player']['summonerName']
                                summoner_queue.append(summonerName.encode('utf-8'))
                                print str(len(summoner_queue)) + ' ' + str(summoner_queue)
                            collection_match.insert_one(match_j)
                            print("Sleep: --- %s seconds ---" % (time.time() - start_time))
                        time.sleep(1)
                    else:
                        print 'Match in Database'
    print("End: --- %s seconds ---" % (time.time() - start_time))
    main()


def requestSummonerID(region, summonerName):
    response = requests.get(env.URL.format(region) + env.summonerCall.format(summonerName, env.APIkey))
    print 'Summoner OK' if response.status_code == 200 else response.json()
    return response.json() if response.status_code == 200 else {'id': -1}


def requestMatchList(region, accountId):
    response = requests.get(env.URL.format(region) + env.matchesCall.format(accountId, env.APIkey))
    print 'MatchList OK' if response.status_code == 200 else response.json()
    if response.status_code == 404:
        return []
    if response.status_code == 500:
        exit()
    response_json = response.json()
    matches = response_json['matches']
    # end_index = response_json['endIndex']
    # while len(response_json['matches']) == 100:
    #     pruebaBucleMatches(region, accountId, end_index)
    #     print("matchList bucle: --- %s seconds ---" % (time.time() - start_time))
    #     response_json = pruebaBucleMatches(region, accountId, end_index).json()
    #     matches += response_json['matches']
    #     end_index = response_json['endIndex']
    # print len(matches)
    return matches


def pruebaBucleMatches(region, accountId, beginIndex):
    response = requests.get(env.URL.format(region) + env.matchesNextCall.format(accountId, env.APIkey, beginIndex))
    return response


def requestRanks(region, summonerId):
    response = requests.get(env.URL.format(region) + env.leagueCall.format(summonerId, env.APIkey))
    print 'Rank OK' if response.status_code == 200 else response.json()
    if response.status_code == 500:
        exit()
    return response.json() if response.status_code == 200 else {'ranks': []}


def requestSingleMatch(region, matchId):
    response = requests.get(env.URL.format(region) + env.matchCall.format(matchId, env.APIkey))
    if response.status_code == 500:
        exit()
    return response


def getPartitipantIdentity(summonerName, participantsIdintities):
    for participantIdentity in participantsIdintities:
        if (participantIdentity['player']['summonerName'] == summonerName):
            return participantIdentity['participantId']


def getParticipantTeamId(participant_id, participant_list):
    for participant in participant_list:
        # print participant['teamId']
        if participant['participantId'] == participant_id:
            return participant['teamId']


if __name__ == '__main__':
    main()
