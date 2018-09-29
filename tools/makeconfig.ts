import * as FileSystem from 'fs';
import { myLogger } from "../src/common/mylogger";
import Utils from '../src/common/utils';
import { XML2TSConfig } from './xml2tsconfig';

enum ArgumentCommandEnum {
    MAKEALL = '-makeall',
    MAKE = '-make',
    ADDALL = '-addall',
    ADD = '-add'
}

class Main {
    static async main() {
        let args = process.argv;
        if (args.length >= 3) {
            switch (args[2].toLowerCase()) {
                case ArgumentCommandEnum.MAKEALL:
                    for (let pathFile of Utils.readDir('./conf')) {
                        await Main.convertXML2Config(pathFile);
                    }
                    Main.addConfigFiles('src/module/configmanager');
                    break;
                case ArgumentCommandEnum.ADD: //加Config到指定的文件内
                    if (!args[3]) {
                        myLogger.error('缺少需要生成文件的文件名字。')
                        return -2;
                    }
                    let pathFile = `${args[2]}`;
                    if (!FileSystem.existsSync(`${pathFile}.xml`)) {
                        myLogger.error(`${pathFile}.xml 文件不存在`);
                        return -1;
                    }
                    Main.convertXML2Config(pathFile);
                    break;
                case ArgumentCommandEnum.ADDALL: //加Config到指定的文件内
                    if (args[3]) {
                        Main.addConfigFiles(args[3]);
                    } else {
                        Main.addConfigFiles();
                    }
                    break;
                case ArgumentCommandEnum.ADD: //加Config到指定的文件内
                    if (args.length<=5) {
                        XML2TSConfig.getInstance().addConfig(args[3], args[4]);
                    } else {
                        myLogger.error('参数个数有问题');
                    }
                    break;
                default:
                    break;
            }
        } else {
            myLogger.error(`参数不对，至少包含一个参数才可以运行。`)
        }

        return Promise.resolve;
    }

    private static async convertXML2Config(pathFile: string) {
        // let fileName = Path.basename(pathFile, '.xml');
        await XML2TSConfig.getInstance().generateTSConfig(pathFile);
        return Promise.resolve;
    }

    private static addConfigFiles(destFile:string='src/module/configmanager') {
        for (let pathFile of Utils.readDir('./tools/autots', '.ts')) {
            XML2TSConfig.getInstance().addConfig(`${pathFile}`, destFile);
        }        
    }
}

Main.main();