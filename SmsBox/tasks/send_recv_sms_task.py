#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import json
import logging
import re
import serial
import time
from gsmmodem.pdu import encodeSmsSubmitPdu, decodeSmsPdu
from gsmmodem.serial_comms import SerialComms
# from tasks import errors

log = logging.getLogger("request")
access = logging.getLogger("access")

class SendRecvSmsTask:
    def __init__(self, com, config, redis_driver):
        self.com = com
        self.config = config
        self.redis_driver = redis_driver
        # self.port_num_list = config['port_list']
        # self.last_use_port_index = -1     #记录上一次空闲的端口号的下标
        self.order = None   #当前正在处理的订单信息
        # self.port_list = []
        # for port in self.port_num_list:
        self.ser = serial.Serial(self.com, 115200, timeout=self.config['serial_timeout'])
        # self.port_list.append(ser)

        # 端口测试
        # self.test_port()

        #对串口进行配置

        log.info('>>start config port {0}<<'.format(self.com))
        log.info("residual  info:".format(self.ser.readlines()))     #读取剩余的信息
        self.ser.write(str(chr(27)).encode() )
        log.info(self.ser.readlines())

        self.ser.write(b"AT&V\r\n")                  #显示当前所有配置信息
        log.info(self.ser.readlines())

        self.ser.write(b"AT+QCCID\r\n")              #读取sim卡唯一标识
        log.info(self.ser.readlines())

        self.ser.write(b"AT+CNMI?\r\n")              #读取当前的短消息配置
        log.info(self.ser.readlines())

        self.ser.write(b"AT+CNMI=2,1,0,0,0\r\n")     #设置短消息配置
        log.info(self.ser.readlines())

        self.ser.write(b'AT+CSCS="GSM"\r\n')         #设置TE字符集
        log.info(self.ser.readlines())

        self.ser.write(b"AT+CMGF=0\r\n")             #设置PDU模式0
        log.info(self.ser.readlines())

        self.ser.write(b"AT+CSCA?\r\n")              #读取消息中心地址
        ser_output = self.ser.readlines()
        log.info(ser_output)
        ser_output = ser_output[1].decode()
        self.ser.smsc = re.search(r'\+CSCA: "(.*)"', ser_output).groups()[0]
        log.info('SMSC: {0}'.format(self.ser.smsc))

        '''
        #收短信配置
        ser.write(b"AT+CMGF=1\r\n")
        log.info(ser.readlines())
        ser.write(b"AT+CNMI=2,1,0,1,1\r\n")     # 新短消息提示
        log.info(ser.readlines())
        ser.write(b"AT+CMGF=0\r\n")             # 设置短消息模式
        log.info(ser.readlines())
        ser.write(b'AT+CSCS="UCS2"\r\n')        # 设置短消息字符集
        log.info(ser.readlines())
        ser.write(b'AT&W"\r\n')                 # 保存配置
        log.info(ser.readlines())
        '''

    # 端口测试
    def test_port(self):
        cpas_code = {"0": "准备（ME允许来自TA/TE 的命令）",
                "2": "未知（ME未授权响应指令）",
                "3": "振铃（ME准备好接收来自TA/TE的命令，但正在振铃）",
                "4": "呼叫进行中（ME 准备好来自TA/TE 的命令，但当前有一个呼叫正在进行"}
        access.info(">>start test port {0}<<".format(self.com))
        access.info("residual  info: {0}".format(self.ser.readlines()))
        self.ser.write(b"AT+CPAS\r\n")
        ser_out = self.ser.readlines()
        cpas_out = ser_out[1].decode().strip()
        # access.info("CPAS info: {0}, {1} and CPAS_OUT : {2} | {3} | {4}".format(ser_out[1], ser_out[-1], cpas_out, cpas_out.find("+CPAS:"),cpas_out.split(":")[-1]))
        if len(ser_out) and ser_out[-1] == b'OK\r\n' and cpas_out.find("+CPAS:") == 0:
            cpas = cpas_out.split(": ")[-1]
            cpas_result = cpas_code[cpas]
            if cpas == "0":
                access.info(">>port {0} OK!! Cause: Code <{1}> , {2}<<".format(self.com, cpas, cpas_result))
            elif cpas == "2":
                access.info(">>port {0} ERROR!! Cause: Code <{1}> , {2}<<\n>>Maybe NOT SIM!!<<".format(self.com, cpas, cpas_result))
                self.ser.write(b"AT+QCCID\r\n")              #读取sim卡唯一标识
                access.info(self.ser.readlines())
                return sys.exit()
            elif cpas == "3" or cpas == "4":
                access.info(">>port {0} is Rang or Calling!!Please try again!! Cause: Code <{1}> , {2}<<".format(self.com, cpas, cpas_result))
                self.ser.write(b"ATH\r\n")
                access.info(self.ser.readlines())
                return self.test_port()
            elif cpas not in cpas_code:
                access.info(">>port {0} ERROR!! Cause: UnKnow<<".format(self.com))
                return sys.exit()
        else:
            access.info(">>port {0} ERROR!! Cause: UnKnow<<".format(self.com))
            return sys.exit()

    #读取短信订单
    def get_order(self):
        #从redis里面抓取订单
        order = None
        try:
            order = self.redis_driver.master.lpop("mobile:message:finish")
            if order:
                log.info('SendRecvSmsTask get_order {0}'.format(order))
        except:
            log.exception('SendRecvSmsTask get_order error')
        return order



    def recv_message(self):
        # for ser in self.com:
        self.ser.write(b"AT+QCCID\r\n")
        ser_output = self.ser.readlines()
        #log.debug('SendRecvSmsTask get_idle_com port2 com {0} output: {1}'.format(ser.port, ser_output))
        qccid = None
        phone = None
        if len(ser_output) and  ser_output[-1] == b'OK\r\n':
            qccid = ser_output[1].decode().strip()
            phone = self.config['phone_list'].get(qccid)
            #log.debug('SendRecvSmsTask get_idle_com  com {0} port3 phone: {1}'.format(ser.port,phone))

        if not qccid:
            pass
        # continue

        self.ser.write(b'AT+CMGL=0\r\n')  #PDU模式下读取所有未读消息
        ser_output = self.ser.readlines()
        if len(ser_output) > 2:
            log.info('SendRecvSmsTask {0} {1} recv_message: {2}'.format(self.com, phone, ser_output))
            next_parse_flag = False
            for code in ser_output:
                code = code.decode()
                if next_parse_flag:
                    code = code.strip()
                    log.info('SendRecvSmsTask decodeSmsPdu {0}'.format(code))
                    msg_data = decodeSmsPdu(code)
                    log.info('SendRecvSmsTask {0} {1} msg_data: {2}'.format(self.com, phone, msg_data))
                    next_parse_flag = False

                    #对反馈结果进行处理
                    if self.order and msg_data['number'].find("10086") == 0:
                        if msg_data['text'].find('尊敬的客户，您好！该流量卡已被使用。') == 0:
                            self.order == None
                        elif msg_data['text'].find('若您需本月生效请回复D1，次月生效请回复D2，当天回复有效，若未回复，则不开通。') != -1:
                            amount = re.search("该流量卡额度为(\d+.)，", msg_data['text']).groups()[0]
                            log.info("收到回馈信息, 卡额度为 {0}".format(amount))
                            order = {"mobile": msg_data['number'], "msg": "D1"}
                            self.send_message(self.ser, str(order))
                        elif msg_data['text'].find("尊敬的客户，您好！我们已收到您的登记需求") == 0 or msg_data['text'].find("人支付。中国移动") == 0:
                            self.order == None
                        else:
                            pass

                elif code[:6] == '+CMGL:':
                    next_parse_flag = True

        #订单完成时删除所有已读消息
        if self.order == None:
            self.ser.write(b'AT+CMGD=1\r\n')  #删除所有已读消息
            # ser_output = self.ser.readlines()
            #log.debug('SendRecvSmsTask {0} {1} recv_message: {2}'.format(ser.port, phone, ser_output))

    #发送一条消息
    def send_message(self, ser, order):
        order = eval(order)
        log.info('send msg >>{0}<< to {1} use port {2}'.format(order['msg'],order['mobile'],ser.port))

        mobile = order["mobile"]
        msg = order['msg']

        pdu = encodeSmsSubmitPdu(mobile, msg, smsc=ser.smsc)
        PDU = str(pdu[0])
        PDU_length = int(pdu[0].tpduLength) - 8

        log.info('send_message0 {0}'.format(ser.readlines()))
        try:
            content = "AT+CMGS={0}\r\n".format(PDU_length).encode()
            ser.write(content)   # 发送短消息长度

            flag = False
            while True:
                ser_output = ser.readlines()
                log.info('send_message1 {0}'.format(ser_output))

                if not len(ser_output):
                    time.sleep(0.01)
                    continue

                if len(ser_output) == 2:
                    if ser_output[-1] == b"> ":
                        ser.write(PDU.encode())                          # 短消息内容
                        log.info('send_message2 {0}'.format(ser.readlines()))

                        ser.write(str(chr(26)).encode())                               #ctrl+z发送
                        while True:
                            ser_output = ser.readlines()
                            if not len(ser_output):
                                time.sleep(0.01)
                                continue

                            log.info('send_message3 {0}'.format(ser_output))
                            if ser_output[-1] == b'OK\r\n':
                                flag = True
                            break

                if flag:
                    log.info('send_message4 send msg success!!!')
                else:
                    log.error('send_message4 send msg error')
                break
        except:
            ser.write(str(chr(27)).encode())   #esc退出
            log.exception('send_message error')

    #获取空闲端口号
    # def get_idle_com(self):
    #     now_port_index = self.last_use_port_index + 1
    #     now_port_index %= len(self.port_list)
    #     self.last_use_port_index = now_port_index
    #
    #     com = self.port_num_list[now_port_index]['port']
    #
    #     log.debug('SendRecvSmsTask get_idle_com check port {0}'.format(com))
    #
    #     result = False
    #     ser = self.port_list[now_port_index]
    #     try:
    #         ser.write(b"AT+QCCID\r\n")
    #         ser_output = ser.readlines()
    #         log.debug('SendRecvSmsTask get_idle_com port2 com output: {0}'.format(ser_output))
    #         qccid = None
    #         phone = None
    #         if len(ser_output) and  ser_output[-1] == b'OK\r\n':
    #             qccid = ser_output[1].decode().strip()
    #             phone = self.config['phone_list'].get(qccid)
    #             log.debug('SendRecvSmsTask get_idle_com port3 phone: {0}'.format(phone))
    #
    #         if qccid:
    #             ser.write(b"AT+CPAS=?\r\n")
    #             ser_output = ser.readlines()
    #             log.debug('SendRecvSmsTask get_idle_com port4 com output: {0}'.format(ser_output))
    #
    #             if ser_output[-1] == b"OK\r\n":
    #                 result = True
    #     except:
    #         log.exception('SendRecvSmsTask get_idle_com error')
    #
    #     if result == False:
    #         log.debug('SendRecvSmsTask get_idle_com port {0} is not ready!'.format(com))
    #         #一直尝试读取直到有空闲的端口号
    #         time.sleep(0.1)
    #         return self.get_idle_com()
    #     else:
    #         log.debug('SendRecvSmsTask get_idle_com port {0} is ready!'.format(com))
    #         return ser


    #流程控制
    def controller(self):
        while True:
            try:
                #0.先接收已有的消息
                self.recv_message()

                self.redis_driver.master.set('serial_port:flag:{0}:running'.format(self.com), "1")

                flag = self.redis_driver.master.exists('serial_port:flag:run')
                if not flag and self.order == None:
                    log.info('serial_port:flag:run not exists SendRecvSmsTask will quit!!!')
                    self.redis_driver.master.set('serial_port:flag:{0}:exit'.format(self.com), "1")
                    break
                else:
                    pass
                    log.debug('serial_port:flag:run  exists SendRecvSmsTask will keep running!!!')


                if self.order == None:
                    #1.抓取订单
                    self.order = self.get_order()

                    #如果没有订单,退出流程
                    if self.order == None:
                        continue

                    #2.寻找空闲端口
                    # ser = self.get_idle_com()

                    #如果有订单就进行发送操作
                    self.send_message(self.ser, self.order)

                time.sleep(2)

            except:
                log.exception("controller error")


if __name__ == "__main__":
    msg = '0891683108500145F5240AA101563800130008517090714454236860A8597DFF0C56E05E7353F08C036574FF0C8BF75C066B6477ED4FE153D1900181F300310030003000380036FF0C5E76630963D0793A51855BB98FDB884C6D4191CF53616FC06D3BFF0C7ED960A85E2667654E0D4FBF8BF78C0589E3FF0C4E2D56FD79FB52A83002'

