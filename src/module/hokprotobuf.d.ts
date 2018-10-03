import * as $protobuf from "protobufjs";
/** Namespace thanos. */
export namespace thanos {

    /** MsgID enum. */
    enum MsgID {
        id_LoginReq = 1,
        id_LoginAck = 2
    }

    /** Properties of a Login. */
    interface ILogin {

        /** Login msgid */
        msgid?: (thanos.MsgID|null);

        /** Login username */
        username: Uint8Array;

        /** Login password */
        password: Uint8Array;
    }

    /** Represents a Login. */
    class Login implements ILogin {

        /**
         * Constructs a new Login.
         * @param [properties] Properties to set
         */
        constructor(properties?: thanos.ILogin);

        /** Login msgid. */
        public msgid: thanos.MsgID;

        /** Login username. */
        public username: Uint8Array;

        /** Login password. */
        public password: Uint8Array;

        /**
         * Creates a new Login instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login instance
         */
        public static create(properties?: thanos.ILogin): thanos.Login;

        /**
         * Encodes the specified Login message. Does not implicitly {@link thanos.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: thanos.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link thanos.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: thanos.ILogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): thanos.Login;

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): thanos.Login;

        /**
         * Verifies a Login message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Login message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Login
         */
        public static fromObject(object: { [k: string]: any }): thanos.Login;

        /**
         * Creates a plain object from a Login message. Also converts values to other types if specified.
         * @param message Login
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: thanos.Login, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Login to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** LoginResultEnum enum. */
    enum LoginResultEnum {
        Success = 0,
        Failed = 1
    }

    /** Properties of a LoginResult. */
    interface ILoginResult {

        /** LoginResult msgid */
        msgid?: (thanos.MsgID|null);

        /** LoginResult result */
        result: thanos.LoginResultEnum;
    }

    /** Represents a LoginResult. */
    class LoginResult implements ILoginResult {

        /**
         * Constructs a new LoginResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: thanos.ILoginResult);

        /** LoginResult msgid. */
        public msgid: thanos.MsgID;

        /** LoginResult result. */
        public result: thanos.LoginResultEnum;

        /**
         * Creates a new LoginResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResult instance
         */
        public static create(properties?: thanos.ILoginResult): thanos.LoginResult;

        /**
         * Encodes the specified LoginResult message. Does not implicitly {@link thanos.LoginResult.verify|verify} messages.
         * @param message LoginResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: thanos.ILoginResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginResult message, length delimited. Does not implicitly {@link thanos.LoginResult.verify|verify} messages.
         * @param message LoginResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: thanos.ILoginResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): thanos.LoginResult;

        /**
         * Decodes a LoginResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): thanos.LoginResult;

        /**
         * Verifies a LoginResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginResult
         */
        public static fromObject(object: { [k: string]: any }): thanos.LoginResult;

        /**
         * Creates a plain object from a LoginResult message. Also converts values to other types if specified.
         * @param message LoginResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: thanos.LoginResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
