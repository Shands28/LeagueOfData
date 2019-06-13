# coding=utf-8
import time

from pymongo import MongoClient
import requests
import env

client = MongoClient('localhost', 27017)
database = client['LeagueOfData']
collection_matches = database['matches']
collection_summoners = database['summoners']
collection_queues = database['queues']


def main():
    for i in range(3, 0, -1):
        for summoner in collection_queues.find({'priority': {'$eq': i}}):
            summonerName = summoner['summonerName'] + ''
            region = summoner['region']
            json_summoner = request_summoner(region, summonerName)
            if id != -1:
                data = {
                    'id': json_summoner['id'],
                    'accountId': json_summoner['accountId'],
                    'summonerName': json_summoner['name'],
                    'summonerLevel': json_summoner['summonerLevel'],
                    'profileIconId': json_summoner['profileIconId'],
                    'region': region
                }
                json_ranks = request_ranks(region, data['id'])
                data['ranks'] = json_ranks
                collection_summoners.replace_one({'$and': [{'summonerName': summonerName}, {'region': region}]}, data,
                                                 True)
                collection_queues.delete_one({'summonerName': summonerName, 'region': region})
                matchList = request_match_list(region, data['accountId'])
                if len(matchList) > 0:
                    for match in matchList:
                        if collection_matches.find_one({'gameId': match['gameId']}) is None:
                            match_r = request_single_match('euw1', match['gameId'])
                            if match_r.status_code == 200:
                                match_j = match_r.json()
                                collection_matches.insert_one(match_j)
                            time.sleep(1.1)
                        else:
                            print 'Match in Database'
                    else:
                        print 'No matches found'
            else:
                print 'Error in summoner'
        print 'Queue over'
    time.sleep(10)
    main()


def request_summoner(region, summoner_name):
    response = requests.get(env.URL.format(region) + env.summonerCall.format(summoner_name, env.APIkey))
    time.sleep(1)
    print 'Summoner OK' if response.status_code == 200 else response.json()
    return response.json() if response.status_code == 200 else {id: -1}


def request_ranks(region, summoner_id):
    response = requests.get(env.URL.format(region) + env.leagueCall.format(summoner_id, env.APIkey))
    time.sleep(1)
    print 'Rank OK' if response.status_code == 200 else response.json()
    return response.json() if response.status_code == 200 else {'ranks': []}


def request_match_list(region, account_id):
    response = requests.get(env.URL.format(region) + env.matchesCall.format(account_id, env.APIkey))
    time.sleep(1)
    print 'MatchList OK' if response.status_code == 200 else response.json()
    if response.status_code == 404:
        return []
    response_json = response.json()
    matches = response_json['matches']
    return matches


def request_single_match(region, match_id):
    response = requests.get(env.URL.format(region) + env.matchCall.format(match_id, env.APIkey))
    time.sleep(1)
    return response


if __name__ == '__main__':
    main()
