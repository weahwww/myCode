__author__ = 'xdg'

import serial.tools.list_ports

if __name__ == "__main__":
    ports = list(serial.tools.list_ports.comports())
    print(len(ports))
    for p in ports:
        print(p)