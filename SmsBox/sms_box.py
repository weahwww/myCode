#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import logging
import logging.config
import os
import sys
import re
import yaml
from drivers.redis_driver import RedisDriver
from tasks.send_recv_sms_task import SendRecvSmsTask


if __name__ == "__main__":
    #com = sys.argv[1]
    com = "COM22"
    log_config = yaml.load(open('logging.yaml', 'r'))
    log_config['handlers']['request']['filename'] = "logs\\" + com + "_" + log_config['handlers']['request']['filename']
    print(log_config['handlers']['request']['filename'][:-4])
    if not os.path.exists(log_config['handlers']['request']['filename'][:-4]):
        os.makedirs(log_config['handlers']['request']['filename'][:-4])
    try:
        logging.config.dictConfig(log_config)
    except ValueError as e:
        print(e)

    config = yaml.load(open('config.yaml', 'r'))

    redis_driver = RedisDriver(config['cache'])

    work_task = SendRecvSmsTask(com, config['task_config'], redis_driver)

    work_task.controller()


