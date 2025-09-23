export type Encodable = Record<string, unknown> | unknown[] | null | string | number | boolean;
interface EncoderDecoder {
    encode(obj: Encodable): string;
    decode(str: string): Encodable;
}
declare const encoderDecoder: EncoderDecoder;
export default encoderDecoder;
