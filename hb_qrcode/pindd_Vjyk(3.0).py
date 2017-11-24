import threading
from queue import Queue
import qrcode
from pymongo import MongoClient, DESCENDING
import sys
import os
import math
import time
import datetime
import xml.etree.ElementTree as ET
import tornado.ioloop
import tornado.web
import tornado.gen
import tornado.httpclient
import json
from PIL import Image, ImageDraw, ImageFont
import glob
import logging
logger = logging.getLogger("Pindd")

# 指定logger输出格式
formatter = logging.Formatter('%(asctime)s %(levelname)-8s: %(message)s')

# 文件日志
if not os.path.exists('./logs'):
    os.mkdir('logs')
file_handler = logging.FileHandler("./logs/pindd.log")
file_handler.setFormatter(formatter)  # 可以通过setFormatter指定输出格式

# 控制台日志
console_handler = logging.StreamHandler(sys.stdout)
console_handler.formatter = formatter  # 也可以直接给formatter赋值

# 为logger添加的日志处理器
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 指定日志的最低输出级别，默认为WARN级别
logger.setLevel(logging.INFO)
op_queue = Queue(200)
info_queuq1 = Queue(200)
info_queuq2 = Queue(200)
wait_queue= Queue(2)
power_queue = Queue(2)
power_queue.put(1)
thread_lock = threading.Lock()
conn = MongoClient('mongodb://localhost:27017/')
order_url = 'http://118.178.149.142:8191/fenqile/getOrder'#获取猫拍订单地址
callback_url = 'http://118.178.149.142:8191/fenqile/callBack'#回调订单地址
Name_Map = {'fee_slow':u'花呗','jyk':u'加油卡'}
btn_map={'100':(40,500),'200':(137,500),'300':(250,500),'500':(335,500),'1000':(50,556),'2000':(160,555),'3000':(260,555),'4000':(370,555),'5000':(56,610),'10000':(164,608)}
#num_map = {'1':(132,574),'2':(242,571),'3':(351,580),'4':(132,656),'5':(242,656),'6':(351,656),'7':(132,736),'8':(242,736),'9':(351,736),'0':(242,806)}
jykbtn_Map= {'1000' : (84,505), '2000': (245,500), '3000': (84,555), '4000': (245,555), '5000': (84,608), '6000': (245,606), '7000': (93,664), '8000': (249,663), '9000': (91,721), '10000': (252,717)}
web_jykbtn_map = {'1000' : (73, 390),'2000': (211, 393),'3000':(345, 391),'4000':(69,438),'5000':(214,432),'6000':(350,432),'7000':(76,480),'8000':(218,478),'9000':(350,480),'10000':(75,524)}

def get_order():
    while True:
        http_client = tornado.httpclient.HTTPClient()
        body={'supId':'fenqile','receiver':'pindd','getNumber':1,'facevalue':None}
        try:
            response = http_client.fetch(url=order_url,method = 'POST',body=json.dumps(body),request_time_out=120)
            res=json.loads(response.body.decode())
            logger.info('猫拍获取订单'+res)
            orderid = res.get('tradeNo')
            price = res.get('faceValue')
            mobile = res.get('phoneNo')
            create_time = res.get('addTime')
            product='fee_slow'
            info_list = [mobile,price,create_time,'0',product]
            conn.code.image.insert( {'name':Name_Map.get(product),'product':product,'mobile':str(mobile),'price':str(price),'create_time':create_time,'orderid':orderid,'time': datetime.datetime.now(),'status':'running'})
            info_queuq1.put(info_list)
        except tornado.httpclient.HTTPError as e:
            logger.exception(e)
        http_client.close()
        time.sleep(10)

def add_word(pattern,price,create_time):
    setFont = ImageFont.truetype('C:/windows/fonts/simhei.ttf', 30)
    fillColor = "#ff0000"

    for img in glob.glob(pattern):
        image = Image.open(img)
        draw = ImageDraw.Draw(image)
        width, height = image.size
        draw.text((0, 0), u'价格:%s元'%price, font=setFont, fill=fillColor)
        draw.text((0, 30), u'No.%s' % time.strftime("%Y%m%d%H%M%S", time.localtime(float(create_time[:-3]))), font=setFont, fill=fillColor)
        image.save(img,'png')

def check(url):
    res=list(conn.code.url.find({'url':url}))
    if res==[]:
        return True
    else:
        return False

def get_login():
    path = 'C:/Work'  # 此路径为固定值，若要修改，需要连同fiddler4脚本中路径一起修改
    if not os.path.exists(path):
        os.mkdir(path)
    try:
        files = os.listdir(path)
        urllist = []
        # 获取fiddler抓到的mclient请求连接
        a=0
        for each in files:
            if each.startswith('login'):
                if a>1:
                    return
                a+=1
                logger.info(u'已抓到连接，待处理')
                f1 = open(os.path.join(path, each), 'r')
                uri = 'https://mclient.alipay.com%s' % f1.readlines()[0].split(' ')[1].replace('"','')
                f1.close()
                if check(uri):
                    conn.code.url.insert({'url': uri,'time': datetime.datetime.now(),'status':'wait'})
                    urllist.append(uri)
                os.remove(path+'/'+each)#删除已解析的txt文件

        #print urllist
        # if urllist!=[]:
        #     op_queue.put('\n\n'.join(urllist))#与pyqt界面相关
            # print each
        for each in urllist:
            logger.info(u'二维码制作中...')
            filter_dict = {'url': each}
            res = list(conn.code.url.find(filter_dict))[0]
            res['status'] = 'used'
            conn.code.url.update(filter_dict, res)
            qr = qrcode.QRCode(
                version=10,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=4,
                border=4
            )
            qr.add_data(each)
            qr.make(fit=True)
            url = qr.make_image()
            # url.svg('uca-url.svg', scale=8)
            # url.eps('uca-url.eps', scale=2)
            if not wait_queue.empty():
                task=wait_queue.get()
                price, mobile, create_time, num, product = task
                filename="./code/alipay_%s.png"%(str(create_time))#此处已经实现task与qrcode的一一对应
                url.save(filename)
                img1 = Image.open(filename)
                width = img1.size[0]
                height = img1.size[1]
                img2 = Image.new('RGBA',(width,height+60))
                # img1 = Image.new('RGBA',(width,10))
                img2.paste(img1, (0, 60))
                img2.save(filename)
                add_word(filename,price,create_time)
                fd = {'price':price,'mobile':mobile,'create_time':create_time}
                orderid= list(conn.code.image.find(fd))
                if orderid!=[]:
                    orderid = orderid[0].get('orderid')
                if not orderid:
                    conn.code.image.update(fd,{'name':Name_Map.get(product),'product':product,'price': str(price),'mobile':str(mobile),'create_time':str(create_time),'num':num,'image':filename,'status':'wait','time':datetime.datetime.now()})
                else:
                    conn.code.image.update(fd, {'name':Name_Map.get(product),'product': product, 'price': str(price), 'mobile': str(mobile),
                                                'create_time': str(create_time), 'num': num, 'image': filename,
                                                'status': 'wait', 'orderid':orderid, 'time': datetime.datetime.now()})
                logger.info(str(task)+'运行结果为:'+filename)
                power_queue.put(1)#归还唯一操作权


    except Exception as e:
        logger.exception(e)
        if power_queue.empty():
            power_queue.put(1)

def main():
    logger.info(u'监测中...')
    while True:
        get_login()
        time.sleep(1)
def unlock_screen(adb_device):
    res = os.popen('adb -s %s shell dumpsys power | findstr "Display Power: state=\\"' % adb_device).readlines()
    if str(res[-1]) == 'Display Power: state=OFF\r\n':
        os.popen('adb -s %s shell input keyevent 26' % adb_device)
    time.sleep(1)
    os.popen('adb -s %s shell input swipe 244 730 244 200'% adb_device)
    time.sleep(1)
    os.popen('adb -s %s shell input text 0000'% adb_device)
    time.sleep(0.5)
    os.popen('adb -s %s shell input tap 410 738'% adb_device)
    time.sleep(1)

def check_screen(adb_device, text):
    os.popen('adb -s %s shell uiautomator dump /sdcard/%s_ui.xml'%(adb_device,adb_device))
    time.sleep(1)
    os.popen('adb -s %s pull /sdcard/%s_ui.xml c:/Work'%(adb_device,adb_device))
    time.sleep(1)
    try:
        tree = ET.parse('c:/Work/%s_ui.xml'%adb_device)
        root = tree.getroot()
        res = []
        res2 = []
        for neighbor in root.iter('node'):
            res.append(neighbor.attrib['content-desc'])
        for neighbor in root.iter('node'):
            res2.append(neighbor.attrib['text'])
        if text in res or text in res2:
            return True
    except Exception as e:
        logger.exception(u'%s该设备不受控制,请重启程序'%adb_device)
        return False

def open_pindd_app(adb_device):
    os.popen('adb -s %s shell am start -n com.xunmeng.pinduoduo/com.xunmeng.pinduoduo.ui.activity.MainFrameActivity' % adb_device)
    time.sleep(10)
    os.popen('adb -s %s shell input keyevent 4'% adb_device)
    time.sleep(5)
    os.popen('adb -s %s shell input keyevent 4'% adb_device)

def open_uc_pindd_app(adb_device):
    os.popen('adb -s %s shell am start -n com.UCMobile/com.uc.browser.InnerUCMobile' % adb_device)
    time.sleep(10)
    # os.popen('adb -s %s shell input keyevent 4' % adb_device)
    # time.sleep(4)
    os.popen('adb -s %s shell input tap 240 815' % adb_device)  #uc菜单
    time.sleep(2)
    os.popen('adb -s %s shell input tap 56 557' % adb_device)   #点击收藏夹
    time.sleep(2)
    os.popen('adb -s %s shell input tap 90 288' % adb_device)   #打开pdd网址
    time.sleep(6)
    # url = r'\"dwz.cn/6Trxou\"'
    # os.popen('adb -s %s shell input text %s' % (adb_device, url))
    # time.sleep(4)
    # os.popen('adb -s %s shell input tap 438 69' % adb_device) #点击进入
    # time.sleep(10)
    return 1

def login_account(adb_device):
    a = 0
    while True:
        if a>5:
            os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% adb_device)
            return 9
        if check_screen(adb_device,u'聊天'):
            os.popen('adb -s %s shell input tap 336 809' % adb_device)
            time.sleep(1)
            os.popen('adb -s %s shell input tap 244 580' % adb_device)
            time.sleep(2)
            os.popen('adb -s %s shell input tap 266 334' % adb_device)
            time.sleep(4)
            i=0
            time.sleep(2)
            if not check_screen(adb_device,u'聊天'):
                while True:
                    if i>30:
                        os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% adb_device)
                        return 9
                    if check_screen(adb_device,u'QQ浏览器X5内核提供技术支持') or check_screen(adb_device,u'确认登录'):
                        os.popen('adb -s %s shell input tap 237 618' % adb_device)
                        time.sleep(2)
                        if check_screen(adb_device,u'聊天'):
                            return 1
                        else:
                            os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% adb_device)
                            return 9
                    else:
                        i+=1
                        time.sleep(1)
            return 1
        a+=1   
        time.sleep(2)

def web_order(adb_device,info_list):
    price, mobile, create_time, num, product = info_list
    time.sleep(2)
    os.popen('adb -s %s shell input tap 236 747'% adb_device)#单独购买
    time.sleep(2)
    if product == 'web_jyk':
        os.popen('adb -s %s shell input tap %s %s' % (adb_device, web_jykbtn_map.get(str(price))[0], web_jykbtn_map.get(str(price))[1]))

    time.sleep(2)
    os.popen('adb -s %s shell input tap 240 750'% adb_device)#确定
    print('确定')
    time.sleep(5)
    # i = 0
    # ss = ''
    # if product == 'web_jyk':
    #     ss = u'加油卡'
    # while not check_screen(adb_device,ss):
    #     if i > 20:
    #         set_web_fail(info_list, adb_device)
    #         return
    #     time.sleep(1)
    #     i += 1
    os.popen('adb -s %s shell input tap 350 577'% adb_device)#点击更多支付方式
    print('点击更多支付方式')

    time.sleep(2)
    os.popen('adb -s %s shell input tap 79 592'% adb_device)#点击支付宝
    print('点击支付宝')

    time.sleep(1)
    os.popen('adb -s %s shell input tap 190 135'% adb_device)#点击输入框
    print('点击输入框')

    #输入号码
    time.sleep(1)
    os.popen('adb -s %s shell input text %s'% (adb_device,str(mobile)))
    time.sleep(1)
    os.popen('adb -s %s shell input tap 357 197'% adb_device)#点击空白，使得支付按钮归位
    time.sleep(1)

    #if num!='1':
       # os.popen('adb -s %s shell input tap 413 410' % adb_device)#点击数量
    #    os.popen('adb -s %s shell input tap 434 735' % adb_device)#点击清除掉1
    #    time.sleep(1)
     #   os.popen('adb -s %s shell input text %s' % (adb_device, num))
    #    time.sleep(1)
    #    os.popen('adb -s %s shell input tap 334 219' % adb_device)  # 点击空白，使得支付按钮归位
     #   time.sleep(1)
    os.popen('adb -s %s shell input tap 384 747'% adb_device)#支付
    time.sleep(5)
    i = 0
    while not check_screen(adb_device,u'支付宝账户登录'):
        if i>20:
            set_web_fail(info_list,adb_device)
            return
        i+=1
        time.sleep(2)
    i=0
    while not wait_queue.empty():#若wait_queue中有订单待处理，就等待其完成抓取
        time.sleep(5)
        i+=1
        if i>30:
            aa=wait_queue.get()
            set_web_fail(aa,adb_device)
            return
    b = 0
    while True:
        if not power_queue.empty():
            power = power_queue.get()

            if power==1:#必须拿到抓包操作权，操作权唯一
                logger.info(u'%s拿到权限'%adb_device)
                wait_queue.put(info_list)#若没有待处理订单，则将当前订单设为待处理订单，待处理订单是唯一的
                text= u'校验码　'
                if check_screen(adb_device,text):
                    os.popen('adb -s %s shell input tap 384 480'% adb_device)
                else:
                    os.popen('adb -s %s shell input tap 384 410'% adb_device)
                time.sleep(3)
                os.popen('adb -s %s shell input tap 56 76'% adb_device) #支付宝 登陆返回
                time.sleep(2)
                os.popen('adb -s %s shell input tap 56 76' % adb_device)#支付宝 校验码返回
                time.sleep(2)
                os.popen('adb -s %s shell input tap 343 501' % adb_device)#提示框  是
                time.sleep(4)
                os.popen('adb -s %s shell keyevent 3' % adb_device)
                time.sleep(2)
                # os.popen('adb -s %s shell input tap 285 69' % adb_device)#网址框
                # time.sleep(1)
                # # os.popen('adb -s %s shell pm clear com.UCMobile'% adb_device)#清除拼多多缓存
                # os.popen('adb -s %s shell input tap 366 68')#删除掉当前网址，不能清楚UC 不然要重新手机登陆
                break
            time.sleep(3)
        time.sleep(3)

def order(adb_device,info_list):
    price, mobile, create_time, num, product = info_list
    time.sleep(2)
    os.popen('adb -s %s shell input keyevent 4'% adb_device)
    os.popen('adb -s %s shell input tap 400 800'% adb_device)#个人中心
    time.sleep(2)
    os.popen('adb -s %s shell input tap 180 470'% adb_device)#我的收藏
    time.sleep(2)
    i=0
    while not check_screen(adb_device,u"发起拼单"):
        if i>20:
            set_fail(info_list,adb_device)
            return
        time.sleep(1)
        i+=1
    if product=='jyk':
        os.popen('adb -s %s shell input tap 300 222'% adb_device)#选择加油卡店铺
    elif product=='fee_slow':
        os.popen('adb -s %s shell input tap 300 419' % adb_device)  # 选择花呗店铺
    time.sleep(2)
    os.popen('adb -s %s shell input tap 236 815'% adb_device)#单独购买
    time.sleep(2)
    if product=='fee_slow':
        os.popen('adb -s %s shell input tap %s %s'% (adb_device,btn_map.get(str(price))[0],btn_map.get(str(price))[1]))
    elif product=='jyk':
        os.popen('adb -s %s shell input tap %s %s' % (adb_device, jykbtn_Map.get(str(price))[0], jykbtn_Map.get(str(price))[1]))

    time.sleep(2)
    os.popen('adb -s %s shell input tap 240 800'% adb_device)
    time.sleep(5)
    i = 0
    ss=''
    if product=='fee_slow':
        ss = u"充值号码"
    elif product=='jyk':
        ss = u'加油卡'
    while not check_screen(adb_device,ss):
        if i > 20:
            set_fail(info_list, adb_device)
            return
        time.sleep(1)
        i += 1
    os.popen('adb -s %s shell input tap 350 650'% adb_device)#点击更多支付方式
    time.sleep(2)
    os.popen('adb -s %s shell input tap 79 659'% adb_device)#点击支付宝

    time.sleep(1)
    os.popen('adb -s %s shell input tap 190 148'% adb_device)#点击输入框

    #输入号码
    time.sleep(1)
    os.popen('adb -s %s shell input text %s'% (adb_device,str(mobile)))   
    time.sleep(1)
    os.popen('adb -s %s shell input tap 334 219'% adb_device)#点击空白，使得支付按钮归位
    time.sleep(1)

    #if num!='1':
       # os.popen('adb -s %s shell input tap 413 410' % adb_device)#点击数量
    #    os.popen('adb -s %s shell input tap 434 735' % adb_device)#点击清除掉1
    #    time.sleep(1)
     #   os.popen('adb -s %s shell input text %s' % (adb_device, num))
    #    time.sleep(1)
    #    os.popen('adb -s %s shell input tap 334 219' % adb_device)  # 点击空白，使得支付按钮归位
     #   time.sleep(1)
    os.popen('adb -s %s shell input tap 384 818'% adb_device)#支付
    time.sleep(5)
    i = 0
    while not check_screen(adb_device,u'支付宝账户登录'):
        if i>20:
            set_fail(info_list,adb_device)
            return
        i+=1
        time.sleep(2)
    i=0
    while not wait_queue.empty():#若wait_queue中有订单待处理，就等待其完成抓取
        time.sleep(5)
        i+=1
        if i>30:
            aa=wait_queue.get()
            set_fail(aa,adb_device)
            return
    b = 0
    while True:
        if not power_queue.empty():
            power = power_queue.get()

            if power==1:#必须拿到抓包操作权，操作权唯一
                logger.info(u'%s拿到权限'%adb_device)
                wait_queue.put(info_list)#若没有待处理订单，则将当前订单设为待处理订单，待处理订单是唯一的
                text= u'校验码　'
                if check_screen(adb_device,text):
                    os.popen('adb -s %s shell input tap 384 480'% adb_device)
                else:
                    os.popen('adb -s %s shell input tap 384 410'% adb_device)
                time.sleep(3)
                os.popen('adb -s %s shell input tap 56 76'% adb_device)
                time.sleep(1)
                os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% adb_device)#清除拼多多缓存
                break
            time.sleep(3)
        time.sleep(3)

def set_fail(info_list, adb_device):

    logger.info('set fail %s'% str(info_list))
    price, mobile, create_time, num, product = info_list
    os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% adb_device)
    conn.code.image.update({'mobile':mobile,'price':price,'create_time':create_time},{'name':Name_Map.get(product),'product':product,'price': str(price),'mobile':str(mobile),'create_time':str(create_time),'num':num,'image':'./code/fail.png','time':datetime.datetime.now(),'status':'fail'})
    os.popen('adb -s %s shell input keyevent 4'% adb_device)
    os.popen('adb -s %s shell input keyevent 4'% adb_device)

def set_web_fail(info_list,adb_device):
    logger.info('set fail %s'% str(info_list))
    price, mobile, create_time, num, product = info_list
    os.popen('adb -s %s shell keyevent 3' % adb_device)
    time.sleep(2)
    # os.popen('adb -s %s shell input tap 285 69' % adb_device)  # 点击网址框
    # time.sleep(1)
    # os.popen('adb -s %s shell input tap 366 68')  # 删除掉当前网址，不能清楚UC 不然要重新手机登陆
    conn.code.image.update({'mobile':mobile,'price':price,'create_time':create_time},{'name':Name_Map.get(product),'product':product,'price': str(price),'mobile':str(mobile),'create_time':str(create_time),'num':num,'image':'./code/fail.png','time':datetime.datetime.now(),'status':'fail'})
    os.popen('adb -s %s shell input keyevent 4'% adb_device)
    os.popen('adb -s %s shell input keyevent 4'% adb_device)


def operate(adb_device):

    while True:
        # thread_lock.acquire()
        if not info_queuq1.empty():
            info_list= info_queuq1.get()
            logger.info(info_list)
            if info_list:
                logger.info(adb_device+'u设备正在执行操作')
                if check_screen(adb_device,u'解锁'):
                    logger.info(u'屏幕解锁')
                    unlock_screen(adb_device)
                open_pindd_app(adb_device)
                res=login_account(adb_device)
                if res==1:
                    order(adb_device,info_list)
                else:
                    set_fail(info_list,adb_device)
        elif not info_queuq2.empty():
            info_list= info_queuq2.get()
            logger.info(info_list)
            if info_list:
                logger.info(adb_device+'u设备正在执行操作')
                if check_screen(adb_device,u'解锁'):
                    logger.info(u'屏幕解锁')
                    unlock_screen(adb_device)
                res = open_uc_pindd_app(adb_device)
                if res == 1:
                    web_order(adb_device,info_list)
                else:
                    set_web_fail(info_list,adb_device)
        
        time.sleep(1)
        # thread_lock.release()

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect('qrcode.html')

class BatchHandle(tornado.web.RequestHandler):
    def get(self):
        self.redirect('batch.html')

class SubmitHandler(tornado.web.RequestHandler):
    def post(self):
        self.register()

    def register(self):
        try:
            body = json.loads(self.request.body.decode())
            price = body.get('price')
            mobile = body.get('phone')
            create_time = str(body.get('timestamp'))
            num = str(body.get('num'))
            product = body.get('product')
            if product == 'fee_slow':
                if mobile!='' and len(mobile)==11:
                    self.finish(json.dumps({'msg':'ok'}))
                    info_list= [price,mobile,create_time,num,product]
                    info_queuq1.put(info_list)
                    conn.code.image.insert({'name':Name_Map.get(product),'product':product,'price': str(price),'mobile':str(mobile),'create_time':str(create_time),'num':num,'image':'','status':'running','time':datetime.datetime.now()})
                else:
                    self.finish(json.dumps({"msg":"fail"}))
            elif product =='jyk':
                if mobile!='' and len(mobile)==19:
                    self.finish(json.dumps({'msg':'ok'}))
                    info_list= [price,mobile,create_time,num,product]
                    info_queuq1.put(info_list)
                    conn.code.image.insert({'name':Name_Map.get(product),'product':product,'price': str(price),'mobile':str(mobile),'create_time':str(create_time),'num':num,'image':'','status':'running','time':datetime.datetime.now()})
                else:
                    self.finish(json.dumps({"msg":"fail"}))
            elif product == 'web_jyk':
                if mobile != '' and len(mobile) == 19:
                    self.finish(json.dumps({'msg': 'ok'}))
                    info_list = [price, mobile, create_time, num, product]
                    info_queuq2.put(info_list)
                    conn.code.image.insert({'name': Name_Map.get(product), 'product': product, 'price': str(price), 'mobile': str(mobile),'create_time': str(create_time), 'num': num, 'image': '', 'status': 'running','time': datetime.datetime.now()})
                else:
                    self.finish(json.dumps({"msg": "fail"}))
        except Exception as e:
            logger.exception(e)

class GetHandler(tornado.web.RequestHandler):

    def post(self):
        self.send()

    def send(self):
        try:
            body = json.loads(self.request.body.decode())
            price = body.get('price')
            mobile = body.get('phone')
            create_time = str(body.get('timestamp'))
            filter_dict={'mobile':str(mobile),'price':str(price),'create_time':create_time}
            logger.info(str(filter_dict))
            fileinfo=list(conn.code.image.find(filter_dict))
            logger.info(fileinfo)
            if fileinfo!=[]:
                filename=fileinfo[0]['image']
                if filename!='':
                    logger.info(filename)
                    self.finish(json.dumps({'msg':'get_result','data':filename}))
                    res=fileinfo[0]
                    res['status'] = 'used'
                    conn.code.image.update(filter_dict, res)
                else:
                    self.finish(json.dumps({'msg': 'no_result', 'data': ''}))
            else:
                self.finish(json.dumps({'msg':'no_result','data':''}))
        except Exception as e:
            logger.exception(e)

def callback(orderid,status):
    Map={'finish': 1,'fail':0}
    http_client = tornado.httpclient.HTTPClient()
    body = {'orderId':orderid,'status':Map.get(status)}
    try:
        logger.info('猫拍订单回调' + str(body))
        response = http_client.fetch(url=callback_url, method='POST', body=json.dumps(body), request_time_out=120)
        if response and response.code==200:
            res = json.loads(response.body.decode())
            logger.info(res)
            return 1
        else:
            return 9
    except tornado.httpclient.HTTPError as e:
        logger.exception(e)
    http_client.close()


class CallbackHandler(tornado.web.RequestHandler):
    def post(self):

        body = self.request.body.decode()
        logger.info(u'设置 '+body)
        body = json.loads(body)
        create_time = body.get('create_time')
        status = body.get('status')
        if create_time:
            filter_dict = {'create_time': create_time}
            order2 = list(conn.code.image.find(filter_dict))
            if order2!=[]:
                if order2[0].get('orderid'):#若订单号存在
                    for i in range(3):#回调三次
                        if callback(order2[0]['orderid'],status)==1:
                            logger.info('%s回调成功'%order2[0]['orderid'])
                            break
                        else:
                            logger.info('%s回调失败'%order2[0]['orderid'])
            if order2 != []:
                order2 = order2[0]
                if order2['status']=='wait' or order2['status']=='used':
                    order2['status'] = status
                    conn.code.image.update(filter_dict, order2)
                    self.finish(json.dumps({'status': 'ok', 'msg': u'设置成功'}))
                elif order2['status'] =='running' and status=='fail':
                    order2['status'] = status
                    conn.code.image.update(filter_dict, order2)
                    self.finish(json.dumps({'status': 'ok', 'msg': u'设置成功'}))
                else:
                    self.finish(json.dumps({'status': 'ok', 'msg': u'设置失败'}))
            else:
                self.finish(json.dumps({'status': 'ok', 'msg': u'设置失败,不存在的编号参数%s'%create_time}))
        else:
            self.finish(json.dumps({'status': 'ok', 'msg': u'设置失败,缺少编号参数'}))
class SummaryHandler(tornado.web.RequestHandler):
    def post(self):
        req_body =json.loads(self.request.body.decode())
        #logger.info(str(req_body))
        status = req_body.get('status')
        page = req_body.get('page')
        size = req_body.get('size')
        start = req_body.get('start')
        end = req_body.get('end')
        start_time = datetime.datetime.strptime(start, '%Y/%m/%d')
        end_time = datetime.datetime.strptime(end, '%Y/%m/%d')+ datetime.timedelta(days=1)
        filter_dict1 = {}
        filter_dict1.update({'time':{'$gte': start_time, '$lt': end_time},'status':status})
        filter_dict2 = {'time':{'$gte': start_time, '$lt': end_time}}

        if status!='all':
            reslist=list(conn.code.image.find(filter_dict1,{'_id':False,'time':False}).sort("create_time", DESCENDING))
        else:
            reslist = list(conn.code.image.find(filter_dict2,{'_id':False,'time':False}).sort("create_time", DESCENDING))

        totalsize = len(reslist)
        pages = math.ceil(totalsize / size)
        if len(reslist) > size:
            if size * (page - 1) != (totalsize - totalsize % size):
                rbody = json.dumps({"msg": "ok", "max": str(int(pages)), 'data': reslist[size * (page - 1):size * page]})
                #logger.info(rbody)
                self.finish(rbody)
            else:
                rbody = json.dumps({"msg": "ok", "max": str(int(pages)), 'data': reslist[-totalsize % size:]})
                #logger.info(rbody)
                self.finish(rbody)
        else:
            rbody = json.dumps({'msg': 'ok', 'max': str(int(pages)), 'data': reslist})
            #logger.info(rbody)
            self.finish(rbody)

if __name__ == '__main__':
    device_list = []
    try:
        a=os.popen('adb devices').read().split('\n')
        device_list =[each[0:each.index('\t')] for each in a[1:-2]]
    except Exception as e:
        logger.info(u'未获取到设备，重试中...')
        a=os.popen('adb devices').read().split('\n')
        device_list =[each[0:each.index('\t')] for each in a[1:-2]]
    if device_list==[]:
        logger.info(u'未获取到设备，请查看设备是否连接')
        exit(0)
    s= threading.Thread(target=get_order)#获取猫拍订单的线程
    #s.start()
    for each in device_list:
       os.popen('adb -s %s shell pm clear com.xunmeng.pinduoduo'% each)#清除缓存
    logger.info(u'已获取到%s台设备,%s'%(len(device_list),str(device_list)))
    s0 = threading.Thread(target=main)#抓包
    thread_list=[]
    s0.start()
    for each in device_list:
        thread_list.append(threading.Thread(target=operate,args=(each,)))#下单
    for each in thread_list:
        each.start()

    Handlers = [
        (r"/", MainHandler),
        (r"/batch", BatchHandle),
        (r"/api/qrcode/submit", SubmitHandler),#提单
        (r"/api/qrcode_get",GetHandler),
        (r"/api/qrcode/callback", CallbackHandler),#设置成功和失败
        (r"/code/(.*png)", tornado.web.StaticFileHandler, {"path": "code"}),
        (r"/(.*html)", tornado.web.StaticFileHandler, {"path": "static/templates/hb_qrcode"}),
        (r"/((assets|css|js|img|fonts)/.*)", tornado.web.StaticFileHandler, {"path": "static"}),
        (r"/api/qrcode/summary", SummaryHandler)
    ]
    application = tornado.web.Application(Handlers)
    application.listen(8800)
    logger.info('Listen on http://localhost:8800')
    tornado.ioloop.IOLoop.instance().start()

