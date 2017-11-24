#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import serial


class GsmError(serial.SerialException):
    pass


class GsmIOError(GsmError):
    pass


class GsmWriteError(GsmIOError):
    pass


class GsmReadError(GsmIOError):
    pass


class GsmReadTimeoutError(GsmReadError):
    def __init__(self, pending_data):
        self.pending_data = pending_data


class GsmModemError(GsmError):
    STRINGS = {
        "CME": {
            0:   "Phone failure",
            1:   "No connectino to phone",
            2:   "Phone-adaptor link reserved",
            3:   "Operation not allowed",
            4:   "Operation not supported",
            5:   "PH-SIM PIN required (SIM lock)",
            6:   "PH-FSIM PIN required",
            7:   "PH-FSIM PUK required",
            10:  "SIM not inserted",
            11:  "SIM PIN required",
            12:  "SIM PUK required",
            13:  "SIM failure",
            14:  "SIM busy",
            15:  "SIM wrong",
            16:  "Incorrect password",
            17:  "SIM PIN2 required",
            18:  "SIM PUK2 required",
            20:  "Memory full",
            21:  "Invalid index",
            22:  "Not found",
            24:  "Text string too long",
            25:  "Invalid characters in text string",
            26:  "Dial string too long",
            27:  "Invalid characters in dial string",
            30:  "No network service",
            31:  "Netwrk timeout",
            32:  "Network not allowed. Emergency calls only",
            40:  "Network personal PIN required (Network lock)",
            41:  "Network personalization PUK required",
            42:  "Network subset personalization PIN required",
            43:  "Network subset personalization PUK required",
            44:  "Service provider personalization PIN required",
            45:  "Service provider personalization PUK required",
            46:  "Corporate personalization PIN required",
            47:  "Corporate personalization PUK required",
            103: "Illegal MS (#3)",
            106: "Illegal ME (#6)",
            107: "GPRS services not allowed",
            111: "PLMN not allowed",
            112: "Location area not allowed",
            113: "Roaming not allowed in this area",
            132: "Service option not supported",
            133: "Requested service option not subscribed",
            134: "Service option temporarily out of order",
            148: "unspecified GPRS error",
            149: "PDP authentication failure",
            150: "Invalid mobile class",
            151:  "Link NS SP person PIN required",
            152:  "Link NS SP person PUK required",
            153:  "Link SIM C person PIN required",
            154:  "Link SIM C person PUK required",
            302:  "Command conflict",
            601:  "Unrecognized command",
            602:  "Return error",
            603:  "Syntax error",
            604:  "Unspecified",
            605:  "Data transfer already",
            606:  "Action already",
            607:  "Not AT command",
            608:  "Multi command too long",
            609:  "Abort COPS",
            610:  "No call disconnect",
            3513:  "Unread records on SIM",
            3515:  "PS busy",
            3516:  "Couldn't read SMS parameters from SIM",
            3517:  "SM not ready",
            3518:  "Invalid parameter",
            3738:  "CSCS mode not found",
            3742:  "CPOL operation format wron",
            3765:  "Invalid input value",
            3769:  "Unable to get control",
            3771:  "Call setup in progress",
            3772:  "SIM powered down",
            3773:  "Invalid CFUN state",
            3774:  "Invalid ARFCN",
            3775:  "The pin is not in GPIO mode"},
        "CMS": {
            300:   "ME failure",
            301:   "SMS ME reserved",
            302:   "Operation not allowed",
            303:   "Operation not supported",
            304:   "Invalid PDU mode",
            305:   "Invalid text mode",
            310:   "SIM not inserted",
            311:   "SIM pin necessary",
            312:   "PH SIM pin necessary",
            313:   "SIM failure",
            314:   "SIM busy",
            315:   "SIM wrong",
            316:   "SIM PUK required",
            317:   "SIM PIN2 required",
            318:   "SIM PUK2 required",
            320:   "Memory failure",
            321:   "Invalid memory index",
            322:   "Memory full",
            330:   "SMSC address unknown",
            331:   "No network",
            332:   "Network timeout",
            500:   "Unknown",
            512:   "SIM not ready",
            513:   "Message length exceeds",
            514:   "Invalid request parameters",
            515:   "ME storage failure",
            517:   "Invalid service mode",
            528:   "More message to send state error",
            529:   "MO SMS is not allow",
            530:   "GPRS is suspended",
            531:   "ME storage full",
            3513:  "Unread records on SIM",
            3515:  "PS busy",
            3516:  "Couldn't read SMS parameters from SIM",
            3517:  "SM not ready",
            3518:  "Invalid paramete",
            3742:  "Incorrect <oper> format",
            3765:  "Invalid input value",
            3769:  "Unable to get control of required module",
            3771:  "Call setup in progress",
            3772:  "SIM powered down",
            3773:  "Unable to operate in this cfun state",
            3774:  "Invalid arfcn in this band",
            3775:  "The pin is not in GPIO mode"}
    }

    def __init__(self, type=None, code=None):
        self.type = type
        self.code = code

    def __str__(self):
        if self.type and self.code:
            return "%s ERROR %d: %s" % (
                self.type, self.code,
                self.STRINGS[self.type][self.code])

        # no type and/or code were provided
        else:
            return "Unknown GSM Error"
