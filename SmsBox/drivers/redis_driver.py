#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from redis.sentinel import Sentinel

class RedisDriver:
    def __init__(self,config):
        self.config = config
        sentinels = [(c['ip'], c['port']) for c in config['sentinels']]
        self.sentinel = Sentinel(sentinels, socket_timeout=0.1, decode_responses=True)

    @property
    def master(self):
        return self.sentinel.master_for(self.config['name'],db=self.config['db'])

    @property
    def slaver(self):
        return self.sentinel.slave_for(self.config['name'],db=self.config['db'])
