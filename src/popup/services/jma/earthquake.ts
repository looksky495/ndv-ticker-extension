import type { QuakeList } from "../../../types/jma-json/qt/quake-list.d.ts";

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
		vxse5x: async (src: string, type: "vxse51" | "vxse52" | "vxse53"): Promise<void> => {
			const originData = await fetch(src).then(res => res.json()) as any;
			const processedData: EarthquakeReport = {
				type: type.toUpperCase(),
				receiveTime: Date.now(),
				pressTime: new Date(originData.Control?.DateTime ?? Date.now()),
				reportTime: new Date(originData.Head?.ReportDateTime ?? Date.now()),
				targetTime: new Date(originData.Head?.TargetDateTime ?? Date.now()),
				maxIntensity: null,
				shindoList: {},
				originTime: null,
				hypocenter: null,
				magnitude: null,
				isDistant: originData.Head?.Title === "遠地地震に関する情報",
				tsunami: null,
				comments: {
					codes: [],
					ja_JP: [],
					en_US: []
				}
			};

			if (originData.Body?.Comments?.ForecastComment){
				const comment = originData.Body.Comments.ForecastComment;
				processedData.comments.codes?.push(comment.Code);
				processedData.comments.ja_JP.push(comment.Text);
				processedData.comments.en_US.push(comment.Code ? "" : "");
			}
			if (originData.Body?.Comments?.FreeFormComment) processedData.comments.ja_JP.push(originData.Body.Comments.FreeFormComment);
			if (originData.Body?.Intensity){
				processedData.shindoList = {
					regions: [],
					cities: type === "vxse53" ? [] : null
				};
			}
			if (originData.Body?.Earthquake){
				processedData.originTime = new Date(originData.Body.Earthquake.OriginTime);
				processedData.hypocenter = {
					name: originData.Body.Earthquake.Hypocenter?.Area?.Name,
					code: originData.Body.Earthquake.Hypocenter?.Area?.Code,
					coordinate: { latitude: 0, longitude: 0 },
					depth: null,
					detailed: null,
					source: null
				};
				const magnitudeKey = originData.Body.Earthquake.Magnitude as keyof typeof this.jma.magnitude_not_a_number;
				processedData.magnitude = this.jma.magnitude_not_a_number[magnitudeKey] ?? (originData.Body.Earthquake.Magnitude - 0);
			}
			const handler = (this as any)[type];
			if (typeof handler === "function") handler(processedData);
		}
	};
	dmdata: Record<string, unknown> = {};
	events: Record<string, unknown> = {};
	source = "jma";
	notice = false;
	async vxse51 (_data: object){}
	async vxse52 (_data: object){}
	async vxse53 (_data: object){}
	async vxse61 (_data: object){}
	async vxse62 (_data: object){}
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
