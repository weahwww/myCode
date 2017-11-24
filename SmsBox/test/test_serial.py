import logging
import serial
from gsmmodem.modem import GsmModem
from gsmmodem.serial_comms import SerialComms

def main():
    for i in range(19, 34):
        port = "COM{0}".format(i)
        baud = 115200
        modem = SerialComms(port, baud)


        # Print debug info
        print('\n== MODEM DEBUG INFORMATION ==\n')
        print('ATI', modem.write('ATI'))
        print('AT+CGMI:', modem.write('AT+CGMI'))
        print('AT+CGMM:', modem.write('AT+CGMM'))
        print('AT+CGMR:', modem.write('AT+CGMR'))
        print('AT+CFUN=?:', modem.write('AT+CFUN=?'))
        print('AT+WIND=?:', modem.write('AT+WIND=?'))
        print('AT+WIND?:', modem.write('AT+WIND?'))
        print('AT+CPMS=?:', modem.write('AT+CPMS=?'))
        print('AT+CNMI=?:', modem.write('AT+CNMI=?'))
        print('AT+CVHU=?:', modem.write('AT+CVHU=?'))
        print('AT+CSMP?:', modem.write('AT+CSMP?'))
        print('AT+GCAP:', modem.write('AT+GCAP'))
        print('AT+CPIN?', modem.write('AT+CPIN?'))
        print('AT+CLAC:', modem.write('AT+CLAC'))



if __name__ == "__main__2":

    for i in range(3,19):
        com = 'COM{0}'.format(i)
        print(com)
        ser = serial.Serial(com, 115200, timeout=1)
        try:
            ser.write(b"AT+CPAS=?\r\n")
            ser_output = ser.readlines()
            print(ser_output)

            ser.write(b"AT+CIMI\r\n")
            ser_output = ser.readlines()
            print(ser_output)

            ser.write(b"AT+QCCID\r\n")
            ser_output = ser.readlines()
            print(ser_output)

            ser.write(b"AT+QGID\r\n")
            ser_output = ser.readlines()
            print(ser_output)
        except Exception as e:
            print(e)

if __name__ == "__main__":
    main()