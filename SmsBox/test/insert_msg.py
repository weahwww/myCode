#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime
import yaml
from drivers.redis_driver import RedisDriver


if __name__ == "__main__":
    config = yaml.load(open('../config.yaml', 'r'))
    redis_driver = RedisDriver(config['cache'])

    order = dict(order_id=datetime.now().strftime('%Y%m%d%H%M%S'), mobile='10086',
                 msg='LLK#81955327198#18761697631')
    result =redis_driver.master.rpush('mobile:message:finish', order)
    if result:
        print('成功插入一条订单: ', order)

