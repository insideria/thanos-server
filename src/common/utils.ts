import * as XML2JS from 'xml2js';
import * as FileSystem from 'fs';
import * as Crypto from 'crypto';
import * as request from 'request';

class Utils {
    static readConfig(name: string, ext: string='.conf'): any {
        let conFile = FileSystem.readFileSync(`./conf/${name}${ext}`, 'utf8');
        if (conFile == null) {
            return null;
        }
        return JSON.parse(conFile);
    }

    static reverseMap(mapData: Map<any, any>) {
        let reverseData = new Map<any, any>();
        mapData.forEach((value, key) => {
            reverseData.set(value, key);
        }, this);
        return reverseData;
    };

    static md5(data: string) {
        let md5Generate = Crypto.createHash("md5");
        md5Generate.update(data);
        return md5Generate.digest('hex');
    }

    static async asyncRequest<T>(options: request.UrlOptions & request.CoreOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }

    static async getJSObject(file: string) {
        let xmlData = <string>FileSystem.readFileSync(file, "utf-8");

        return new Promise<any>((resolve, reject) => {
            XML2JS.parseString(xmlData, (err: Error, jsonData: any) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(jsonData);
                }
            });
        });
    }

    static mGetDate(year: number, month: number) {
        let d = new Date(year, month, 0);
        return d.getDate();
    }

    static checkNumber(strObj: string): boolean {
        return !isNaN(Number(strObj));
    }

    static readDir(filepath: string, extName: string='xml', fileList:Array<string>=null): Array<string> {
        let pa = FileSystem.readdirSync(filepath);
        if (fileList==null) {
            fileList = new Array<string>();
        }
        pa.forEach((element, index) => {
            let info = FileSystem.statSync(`${filepath}/${element}`);
            if (info.isDirectory()) {
                this.readDir(`${filepath}/${element}`, extName, fileList);
            } else {
                if (element.toLowerCase().endsWith(extName)) {
                    fileList.push(`${filepath}/${element}`);
                }
            }
        });
        return fileList;
    }

    static randNumber(min: number, max: number): number {
        return Math.floor((max - min) * Math.random() + min + 0.5);
    }

    static toHexString(data: ArrayBuffer, splitter: string=' '): string {
        let retString = '';
        let aView = new Int8Array(data)
        for (let index=0; index<data.byteLength; index++) {
            if (index!=0 && splitter!=='') {
                retString += splitter;
            }
            retString += ('0x' + aView[index].toString(16));
        }
        return retString;
    }

    static fillData<T>(datas: Array<T>, data: T) {
        for (let index=0;index<datas.length;index++) {
            datas[index] = data;
        }
    }
}

export default Utils;