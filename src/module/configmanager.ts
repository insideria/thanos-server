import { AutoSample, AutoSampleInfo } from "../../tools/autots/autosample";

export class ConfigManager {
    private static _instance: ConfigManager;
    static getInstance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }

    async initialize() {
        //下面代码会自动生成
        this._autoSample = await AutoSample.getInstance();
    }

    private _autoSample: AutoSample;

    getAutoSampleInfoItem(keyId: number): AutoSampleInfo {
        return this._autoSample.getAutoSampleInfoItem(keyId);
    }
    //下面代码会自动生成
}
