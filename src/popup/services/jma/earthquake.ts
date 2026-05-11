import type { QuakeList } from "../../../types/jma-json/qt/quake-list.d.ts";
// import type { VXSE51 } from "../../../types/jma-json/qt/report-vxse51.js";
// import type { VXSE52 } from "../../../types/jma-json/qt/report-vxse52.js";
// import type { VXSE53 } from "../../../types/jma-json/qt/report-vxse53.d.ts";
// import type { VXSE61 } from "../../../types/jma-json/qt/report-vxse61.js";
// import type { VXSE62 } from "../../../types/jma-json/qt/report-vxse62.js";

export type EarthquakeReport = {
	type: string;
	receiveTime?: Date | number;
	pressTime?: Date | number;
	reportTime?: Date | number;
	targetTime?: Date | number;
	maxIntensity: any;
	shindoList: any;
	originTime: Date | number | null;
	hypocenter: any;
	magnitude: any;
	isDistant: boolean;
	tsunami: any;
	comments: {
		codes?: any[];
		code?: any[];
		ja_JP: any[];
		en_US: any[];
	};
};

export class EarthquakeOperator extends EventTarget {
	jma = {
		url_list: "https://www.jma.go.jp/bosai/quake/data/list.json",
		jsonlist: [] as string[],
		tracker_list: { update () {} },
		shindo_list: { "1": 1, "2": 2, "3": 3, "4": 4, "震度５弱以上未入電": 5, "5-": 6, "5+": 7, "6-": 8, "6+": 9, "7": 10 },
		magnitude_not_a_number: { "M不明": -901, "M8を超える巨大地震": -902, "Ｍ不明": -901, "Ｍ８を超える巨大地震": -902 },
		load: async (): Promise<void> => {
			const list = await fetch(this.jma.url_list + "?_=" + Date.now()).then(res => res.json()) as QuakeList.QuakeList;
			this.jma.tracker_list.update();
			while (!this.jma.jsonlist.includes(list[0]?.json)){
				break;
			}
		},
	};
	events: Record<string, unknown> = {};
	
	async vxse51 (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE51.Report;
	}
	async vxse52 (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE52.Report;
	}
	async vxse5k (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE53.Domestic.Report;
	}
	async vxse5e (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE53.Overseas.Report;
	}
	async vxse61 (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE61.Report;
	}
	async vxse62 (_src: string){
		// const data = await fetch(src).then(res => res.json()) as VXSE62.Report;
	}
	
	async view (_id: string){}
	get latestId (){ return 0; }
	quakeList: any[] = [];
	quakeData = {
		"20210213230800": {
			reports: [
				{
					type: "VXSE51",
					receiveTime: new Date(1613225377059),
					pressTime: new Date(1613225376000),
					reportTime: new Date(1613225340000),
					targetTime: new Date(1613225280000),
					maxIntensity: 9,
					shindoList: {
						regions: [
							{ code: "250", name: "福島県中通り", maxInt: 9 },
							{ code: "251", name: "福島県浜通り", maxInt: 9 },
							{ code: "221", name: "宮城県南部", maxInt: 8 },
							{ code: "222", name: "宮城県中部", maxInt: 8 },
							{ code: "220", name: "宮城県北部", maxInt: 7 },
							{ code: "243", name: "山形県置賜", maxInt: 6 },
							{ code: "300", name: "茨城県北部", maxInt: 6 }
						],
						cities: null
					},
					originTime: null,
					hypocenter: null,
					magnitude: null,
					isDistant: false,
					tsunami: null,
					comments: {
						codes: ["0217"],
						ja_JP: ["今後の情報に注意してください。", "テストデータああああああああああああああ！"],
						en_US: ["Stay tuned for further updates.", "Test Data AAAAAAAAAAAAAAA"]
					}
				}
			],
			detail: {
				label: "福島県沖　最大震度6強　13日23時8分頃発生",
				backcolor: "#febb6f",
				textcolor: "#333333"
			}
		},
		"20210722061500": {
			reports: [
				{
					type: "VXSE53",
					receiveTime: 1626903845509,
					pressTime: 1626903845000,
					reportTime: 1626903840000,
					targetTime: 1626903840000,
					maxIntensity: null,
					shindoList: null,
					originTime: 1626902100000,
					hypocenter: {
						name: "中米",
						code: "945",
						coordinate: { latitude: 7.4, longitude: -82.5 },
						depth: "不明",
						detailed: { code: "1083", name: "パナマ南方" },
						source: "ＰＴＷＣ"
					},
					magnitude: 7.0,
					isDistant: true,
					tsunami: 0,
					comments: {
						code: ["0226", "0230"],
						ja_JP: ["震源の近傍で津波発生の可能性があります。", "この地震による日本への津波の影響はありません。"],
						en_US: ["There is a possibility of tsunami generation near the epicenter.", "This earthquake poses no tsunami risk to Japan."]
					}
				}
			],
			detail: {
				label: "中米　海外の地震　5日12時34分",
				backcolor: "#444444",
				textcolor: "#ffffff"
			}
		}
	};
}
